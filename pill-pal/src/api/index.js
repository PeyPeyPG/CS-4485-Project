const express = require('express');
const authRoutes = require('./auth');

const router = express.Router();
// Expose /register and /login directly
router.use('/', authRoutes);

module.exports = router;

const patientRoutes = require('./patients');
router.use('/patients', patientRoutes);
