const Profile = require('../models/Profile');
const { ObjectId } = require('mongoose').Types;
const User = require('../models/User');

exports.getOne = async (req, res) => {
    const { id } = req.params; //Trocar para req.userId

    const user = await User.findOne({ _id: ObjectId(id) });

    if (!user)
        return res
            .status(404)
            .send({ success: false, message: 'Usuário não encontrado!' });

    const { profile } = user;

    const profileUser = await Profile.findOne({ _id: ObjectId(profile) });

    return res.send({ success: true, user, profileUser });
};

exports.insert = async (req, res) => {
    const {
        name,
        cpf,
        birthDate,
        gender,
        phone,
        number,
        complement,
        address,
        userId,
    } = req.body;

    const profile = await Profile({
        name,
        cpf,
        birthDate,
        gender,
        phone,
        number,
        complement,
        address,
    });

    await profile.save();

    const user = await User.findById(ObjectId(userId));

    user.profile = profile;
    await user.save();

    res.send(user);
};

exports.update = async (req, res) => {
    const { name, cpf, birthDate, gender, phone, number, complement, address } =
        req.body;
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
            birthDate,
            gender,
            phone,
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
