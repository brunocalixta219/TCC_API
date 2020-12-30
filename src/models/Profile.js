const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: Number,
        required: true,
    },
    telephone: Number,
    cellphone: {
        type: Number,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    complement: String,
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model('Profile', ProfileSchema);
