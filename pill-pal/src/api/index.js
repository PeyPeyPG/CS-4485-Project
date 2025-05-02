const express = require('express');
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const patientRoutes = require('./patients');

const router = express.Router();

// Expose /register and /login directly
router.use('/', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/patients', patientRoutes);

module.exports = router;


