const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    diagnosis: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model('Patient', PatientSchema);
