const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const TerapistPatient = require('../models/TerapistPatient');

exports.signIn = async (req, res) => {
    let { email, password } = req.body;

    const user = await User.findOne({ email });

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
            token: generateToken({ id: user.id }),
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
        const newUser = { email, password: hash, role: roleId };
        await User.create(newUser);

        return res.status(200).send({
            message: 'Usuário cadastrado com sucesso!',
            token: generateToken({ id: newUser.id }),
            permissions: newUser.permissions,
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

exports.associatePatient = async (req, res) => {
    const { terapistId, patientId } = req.body;

    // TODO: validar se todos os ids foram informados
    // TODO: validar se existem usuários com os IDs informados
    // TODO: validar se terapistId é o ID de um terapeuta
    // TODO: validar se patientId é o ID de um paciente
    // TODO: criar um TerapistController e mover esse método pra lá

    await TerapistPatient.create({ terapist: terapistId, patient: patientId });
    return res.send({ message: 'Cadastrado com sucesso!' });
};

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 604800,
    });
}
