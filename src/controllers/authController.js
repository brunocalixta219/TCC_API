const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
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
            role: user.role,
            permissions: user.permissions,
        });
    }
};

exports.signUp = async (req, res) => {
    let { email, password, roleId } = req.body;

    const user = await User.findOne({ email });

    if (user) return res.status(400).send({ message: 'Usuário já existente!' });
    else {
        const hash = await bcrypt.hash(password, 10);
        const newUser = { email, password: hash, role: ObjectId(roleId) };
        const createdUser = await User.create(newUser);

        console.log('newUser Id', createdUser.id);

        return res.status(200).send({
            message: 'Usuário cadastrado com sucesso!',
            token: generateToken({ id: createdUser.id }),
            userId: createdUser.id,
            permissions: createdUser.permissions,
        });
    }
};

exports.getUsers = async (req, res) => {
    let userList = {};

    users.forEach((user) => {
        const { id, email } = user;
        userList[id] = email;
    });

    return res.send(userList);
};

exports.savePermission = async (req, res) => {
    const { name } = req.body;
    const permission = { name };

    await Permission.update(permission, permission, { upsert: true });
    return res.send({ message: 'Permissão cadastrada com sucesso!' });
};

exports.saveRole = async (req, res) => {
    const { name, permissions } = req.body;

    if (!permissions || !permissions.length)
        return res
            .status(400)
            .send({ message: 'Informe as permissões do perfil!' });
    const role = { name, permissions };

    await Role.update({ name }, role, { upsert: true });
    return res.send({ message: 'Perfil cadastrado com sucesso!' });
};

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 604800,
    });
}
