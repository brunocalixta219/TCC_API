const Profile = require('../models/Profile');
const { ObjectId } = require('mongoose').Types;
const User = require('../models/User');

exports.getOne = async (req, res) => {
    const { cpf } = req.params;
    const users = await User.find().populate('profile');

    const user = users.find((user) => user.profile?.cpf === cpf);

    if (!user)
        return res
            .status(404)
            .send({ success: false, message: 'Usuário não encontrado!' });

    const { profile } = user;
    return res.send({ success: true, payload: profile });
};

exports.insert = async (req, res) => {
    const {
        name,
        cpf,
        age,
        gender,
        telephone,
        cellphone,
        number,
        complement,
        address,
        userId,
    } = req.body;

    const profile = await Profile({
        name,
        cpf,
        age,
        gender,
        telephone,
        cellphone,
        number,
        complement,
        address,
    });

    await profile.save();

    const user = await User.findById(userId);

    user.profile = profile;
    await user.save();

    res.send(user);
};

exports.update = async (req, res) => {
    const {
        name,
        cpf,
        age,
        gender,
        telephone,
        cellphone,
        number,
        complement,
        address,
    } = req.body;
    const { id } = req.params;

    if (!ObjectId.isValid(id))
        return res.status(400).send({
            success: false,
            message: 'Id de usuário inválido',
        });

    const user = await User.findOne({ _id: ObjectId(id) }, 'profile');
    if (!user)
        return res.status(404).send({
            success: false,
            message: 'Usuário não encontrado',
        });

    const profileId = user.profile;
    const newProfile = await Profile.findOneAndUpdate(
        { _id: profileId },
        {
            name,
            cpf,
            age,
            gender,
            telephone,
            cellphone,
            number,
            complement,
            address,
        },
        { new: true }
    );

    res.send({
        success: true,
        payload: newProfile,
        message: 'Perfil atualizado com sucesso!',
    });
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    if (ObjectId.isValid(id)) {
        const user = await User.findOne({ _id: ObjectId(id) }, 'profile');

        if (user) {
            const profileId = user.profile;
            await Profile.findOneAndDelete({ _id: ObjectId(profileId) });
            await User.findOneAndDelete({ _id: ObjectId(id) });
            console.log('Perfil removido com sucesso');
        } else {
            console.error('Perfil não encontrado');
        }
    } else {
        console.error('Id do perfil inválido');
    }

    res.send('OK');
};
