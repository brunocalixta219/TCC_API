const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const User = require('../models/User');
const { ObjectId } = require('mongoose').Types;

exports.signIn = async (req, res) => {
    let { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user)
        return res.status(400).send({ message: 'E-mail ou senha incorretos!' });
    else {
        let hash = user.password;

        if (!(await bcrypt.compare(password, hash)))
            return res
                .status(400)
                .send({ message: 'E-mail ou senha incorretos!' });

        return res.status(200).send({
            message: 'Login realizado com sucesso!',
            userId: user.id,
            token: generateToken({ id: user.id }),
        });
    }
};

exports.signUp = async (req, res) => {
    let {
        email,
        password,
        name,
        birthDate,
        gender,
        phone,
        number,
        complement,
        street,
        neighborhood,
        cep,
        city,
        state,
    } = req.body;

    const user = await User.findOne({ email });

    if (user) return res.status(400).send({ message: 'Usuário já existente!' });
    else {
        const hash = await bcrypt.hash(password, 10);
        const newUser = {
            email,
            password: hash,
            name,
            birthDate,
            gender,
            phone,
            number,
            complement,
            street,
            neighborhood,
            cep,
            city,
            state,
        };

        const createdUser = await User.create(newUser);

        return res.status(200).send({
            message: 'Usuário cadastrado com sucesso!',
            token: generateToken({ id: createdUser.id }),
            userId: createdUser.id,
        });
    }
};

exports.getOne = async (req, res) => {
    const { id } = req.params;

    const user = await User.findOne({ _id: ObjectId(id) });

    if (!user)
        return res
            .status(404)
            .send({ success: false, message: 'Usuário não encontrado!' });

    return res.send({ success: true, payload: user });
};

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 604800,
    });
}
