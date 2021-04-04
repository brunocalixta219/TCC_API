const express = require('express');
const router = express.Router();
const authRouter = require('./authRouter');
const cepRouter = require('./cepRouter');
const profileRouter = require('./profileRouter');
const terapistRouter = require('./terapistRouter');
const rolesRouter = require('./rolesRouter');
const dashboardRouter = require('./dashboardRouter');

router.use('/auth', authRouter);
router.use('/cep', cepRouter);
router.use('/profile', profileRouter);
router.use('/terapist', terapistRouter);
router.use('/roles', rolesRouter);
router.use('/dashboard', dashboardRouter);

module.exports = router;
