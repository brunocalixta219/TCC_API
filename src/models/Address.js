const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    cep: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    neighborhood: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Address', AddressSchema);
