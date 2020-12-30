const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'Role',
    },
    profile: {
        type: mongoose.Types.ObjectId,
        ref: 'Profile',
    },
});

module.exports = mongoose.model('User', UserSchema);