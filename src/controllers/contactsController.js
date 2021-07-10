const { ObjectId } = require('mongoose').Types;
const Contacts = require('../models/Contacts');
const User = require('../models/User');

exports.getContact = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id))
        return res.status(400).send({
            success: false,
            message: 'Id de usuário inválido',
        });

    const contacts = await Contacts.findOne({ _id: ObjectId(id) });

    if (!contacts) {
        return res.send({
            success: false,
            message: 'Contato não encontrado!',
        });
    }

    return res.send({ success: true, contacts });
};

exports.getContacts = async (req, res) => {
    const { id } = req.params; //Trocar para req.userId

    if (!ObjectId.isValid(id))
        return res.status(400).send({
            success: false,
            message: 'Id de usuário inválido',
        });

    const contacts = await Contacts.find({ user: ObjectId(id) });

    if (!contacts) {
        return res.send({
            success: false,
            message: 'Não existe contatos adicionados para esse usuário!',
        });
    }

    return res.send({ success: true, contacts });
};

exports.deleteContact = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id))
        return res.status(400).send({
            success: false,
            message: 'Id do contato inválido',
        });

    await Contacts.findOneAndDelete({ _id: ObjectId(id) });

    return res.send('OK');
};

exports.insertContact = async (req, res) => {
    const { name, phone } = req.body;
    const userId = req.params; //Trocar para req.userId

    if (!ObjectId.isValid(userId.id))
        return res.status(400).send({
            success: false,
            message: 'Id de usuário inválido',
        });

    const contact = await Contacts.findOne({
        phone: phone,
        user: ObjectId(userId.id),
    });
    const user = await User.findOne({ _id: ObjectId(userId.id) });

    if (contact)
        return res.send({
            success: false,
            message: 'Contato já cadastrado!',
        });

    await Contacts.create({
        name: name,
        phone: phone,
        user: user._id,
    });

    return res.send({
        success: true,
        message: 'Contato adicionado com sucesso!',
    });
};

exports.updateContact = async (req, res) => {
    const { name, phone } = req.body;
    const { id } = req.params;

    if (!ObjectId.isValid(id))
        return res.status(400).send({
            success: false,
            message: 'Id do contato inválido',
        });

    const contact = await Contacts.findOne({ _id: id });

    if (!contact)
        return res.send({
            success: false,
            message: 'Contato não encontrado!',
        });

    const newContact = await Contacts.findOneAndUpdate(
        { _id: id },
        {
            name,
            phone,
        },
        { new: true }
    );

    return res.send({
        success: true,
        payload: newContact,
        message: 'Contato atualizado com sucesso!',
    });
};
