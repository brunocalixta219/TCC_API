const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/:cpf', profileController.getOne);
router.post('/insert', profileController.insert);
router.put('/update/:id', profileController.update);
router.delete('/delete/:id', profileController.delete);

module.exports = router;
