const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/patientData/:id', dashboardController.getOne);

module.exports = router;
