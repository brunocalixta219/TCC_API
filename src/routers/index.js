const express = require('express');
const router = express.Router();
const authRouter = require('./authRouter');
const cepRouter = require('./cepRouter');
const profileRouter = require('./profileRouter');

router.use('/auth', authRouter);
router.use('/cep', cepRouter);
router.use('/profile', profileRouter);

module.exports = router;
