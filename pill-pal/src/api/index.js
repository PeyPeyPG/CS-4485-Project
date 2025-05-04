const express = require('express');
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const patientRoutes = require('./patients');
const medicationsRoutes = require('./medications');
const providerRoutes = require('./providers');

const router = express.Router();

// Expose /register and /login directly
router.use('/', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/patients', patientRoutes);  // Mount patient routes at /patients
router.use('/medications', medicationsRoutes);
router.use('/providers', providerRoutes);  // Mount provider routes at /providers

module.exports = router;
