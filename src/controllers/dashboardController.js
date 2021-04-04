const { ObjectId } = require('mongoose').Types;
const TerapistPatient = require('../models/TerapistPatient');

exports.getOne = async (req, res) => {
    const { id } = req.params;

    const {
        patient: { email, profile },
    } = await TerapistPatient.findOne(ObjectId(id)).populate({
        path: 'patient',
        populate: { path: 'profile' },
    });

    const profileJson = profile.toJSON();

    delete profileJson.__v;
    delete profileJson._id;

    return res.send({ email, ...profileJson });
};
