const express = require('express');
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const patientRoutes = require('./patients');
const medicationsRoutes = require('./medications');

const router = express.Router();

// Expose /register and /login directly
router.use('/', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/patients', patientRoutes);  // Mount patient routes at /patients
router.use('/medications', medicationsRoutes);

module.exports = router;
