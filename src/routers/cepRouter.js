const express = require('express');
const router = express.Router();
const cepController = require('../controllers/cepController');

router.get('/getcep', cepController.getCEP);

module.exports = router;
