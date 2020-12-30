const mongoose = require('mongoose');

const TerapistPatientSchema = new mongoose.Schema({
    terapist: {
        type: String,
        required: true,
        ref: 'User',
    },
    patient: {
        type: String,
        required: true,
        ref: 'User',
    },
});

module.exports = mongoose.model('TerapistPatient', TerapistPatientSchema);
