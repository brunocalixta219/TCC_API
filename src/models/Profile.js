const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    gender: {
        type: Number,
        required: true,
    },
    phone: {
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
});

module.exports = mongoose.model('Profile', ProfileSchema);
