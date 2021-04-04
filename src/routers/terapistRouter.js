const express = require('express');
const router = express.Router();
const terapistController = require('../controllers/terapistController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/addpatient', authMiddleware, terapistController.associatePatient);
router.get('/patientlist', authMiddleware, terapistController.getPatientList);
router.delete(
    '/deleteAssociatePatient/:id',
    terapistController.deleteAssociatePatient
);

module.exports = router;
