const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

router.get('/get', rolesController.get);

module.exports = router;
