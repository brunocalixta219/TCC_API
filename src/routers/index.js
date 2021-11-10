const express = require('express');
const router = express.Router();
const authRouter = require('./authRouter');
const cepRouter = require('./cepRouter');
const contactsRouter = require('./contactsRouter');

router.use('/auth', authRouter);
router.use('/cep', cepRouter);
router.use('/contacts', contactsRouter);

module.exports = router;
