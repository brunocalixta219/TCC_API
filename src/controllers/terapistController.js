const User = require('../models/User');
const { ObjectId } = require('mongoose').Types;
const Role = require('../models/Role');
const Profile = require('../models/Profile');

const TerapistPatient = require('../models/TerapistPatient');

exports.associatePatient = async (req, res) => {
    const { patientCPF } = req.body;
    const terapistId = req.userId;

    const profile = await Profile.findOne({ cpf: patientCPF });

    if (!profile)
        return res.status(400).send({ message: 'Paciente não localizado!' });

    const patientUser = await User.findOne({ profile: profile._id }, 'role');

    if (!ObjectId.isValid(terapistId))
        return res.status(400).send({
            success: false,
            message: 'Id do terapeuta inválido',
        });

    const terapistUser = await User.findOne(
        { _id: ObjectId(terapistId) },
        'role'
    );
    if (!terapistUser)
        return res.status(404).send({
            success: false,
            message: 'Terapeuta não encontrado',
        });

    const roleTerapistUser = terapistUser.role;
    const terapistRole = await Role.findOne({ name: 'Terapeuta' });
    const terapistRoleId = terapistRole._id;

    if (!terapistRoleId.equals(roleTerapistUser)) {
        return res.status(400).send({
            success: false,
            message: 'O id não é de um terapeuta',
        });
    }

    const rolePatientUser = patientUser.role;
    const rolePatient = await Role.findOne({ name: 'Paciente' });
    const roleIdPatient = rolePatient._id;

    if (!roleIdPatient.equals(rolePatientUser)) {
        return res.status(400).send({
            success: false,
            message: 'O id não é de um paciente',
        });
    }

    await TerapistPatient.create({
        terapist: terapistId,
        patient: patientUser._id,
    });

    return res.send({ message: 'Cadastrado com sucesso!' });
};

exports.getPatientList = async (req, res) => {
    try {
        const terapistId = req.userId;
        const terapistPatients = await TerapistPatient.find({
            terapist: terapistId,
        });

        const patientList = [];

        for (const terapistPatient of terapistPatients) {
            const { _id, patient: patientId } = terapistPatient;
            const patientUser = await User.findOne({
                _id: patientId,
            }).populate('profile');

            const { name, cpf } = patientUser.profile;

            patientList.push({ id: _id, name, cpf });
        }

        res.status(200).send(patientList);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.deleteAssociatePatient = async (req, res) => {
    const { id } = req.params;
    if (ObjectId.isValid(id)) {
        const deletedDocument = await TerapistPatient.findOneAndDelete({
            _id: ObjectId(id),
        });

        if (deletedDocument) {
            return res.send({ message: 'Paciente removido com sucesso' });
        } else {
            return res.send({
                message: 'Relação de Paciente e Terapeuta não encontrado',
            });
        }
    } else {
        return res.send({ message: 'Id inválido' });
    }
};
