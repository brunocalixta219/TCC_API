const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/:id', profileController.getOne);
router.post('/insert', profileController.insert);
router.put('/update/:id', profileController.update);

module.exports = router;
