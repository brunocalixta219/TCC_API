const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signin', authController.signIn);
router.post('/signup', authController.signUp);
router.post('/permission', authController.savePermission);
router.post('/role', authController.saveRole);
router.get('/getusers', authController.getUsers);

module.exports = router;
