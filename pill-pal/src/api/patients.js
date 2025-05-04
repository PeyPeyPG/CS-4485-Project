const express = require('express');
const sql = require('mssql');
const router = express.Router();
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
    },
};

// Get all patients
router.get('/patients', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT
                p.Name,
                p.DateOfBirth,
                p.Gender,
                p.Height,
                p.Weight,
                p.PregnancyStatus,
                p.username
            FROM Patients p
        `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching all patients:', err);
        res.status(500).send('Error fetching all patients');
    }
});

// Get patient details by ID
router.get('/patients/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar(255), id)
            .query(`
                SELECT
                    p.Name,
                    p.DateOfBirth,
                    p.Gender,
                    p.Height,
                    p.Weight,
                    p.PregnancyStatus
                FROM Patients p
                WHERE p.username = @username
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching patient details:', err);
        res.status(500).send('Error fetching patient details');
    }
});
// Get providers linked to a patient
router.get('/patients/:username/providers', async (req, res) => {
    const { username } = req.params;
    console.log('Fetching providers for patient:', username);
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('patientUsername', sql.NVarChar(255), username)
            .query(`
                SELECT
                    pp.providerUsername AS username,
                    pr.profession,
                    pr.placeOfWork
                FROM PatientProviders pp
                JOIN Providers pr ON pp.providerUsername = pr.username
                WHERE pp.patientUsername = @patientUsername
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching providers:', err);
        res.status(500).send('Error fetching providers');
    }
});

// Add a new provider for a patient
router.post('/patients/:id/providers', async (req, res) => {
    const { id } = req.params;
    const { providerName, accessGranted } = req.body;

    if (!providerName) {
        return res.status(400).json({ error: 'Provider name is required' });
    }

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('patientUsername', sql.NVarChar(255), id)
            .input('providerUsername', sql.NVarChar(255), providerName)
            .input('accessGranted', sql.Bit, accessGranted)
            .query(`
                INSERT INTO PatientProviders (patientUsername, providerUsername, accessGranted)
                VALUES (@patientUsername, @providerUsername, @accessGranted)
            `);

        res.status(201).json({ message: 'Provider added successfully' });
    } catch (err) {
        console.error('Error adding provider:', err);
        res.status(500).send('Error adding provider');
    }
});

// Delete a provider for a patient
router.delete('/patients/:id/providers/:providerId', async (req, res) => {
    const { id, providerId } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('patientUsername', sql.NVarChar(255), id)
            .input('providerUsername', sql.NVarChar(255), providerId)
            .query(`
                DELETE FROM PatientProviders
                WHERE patientUsername = @patientUsername AND providerUsername = @providerUsername
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        res.status(200).json({ message: 'Provider removed successfully' });
    } catch (err) {
        console.error('Error removing provider:', err);
        res.status(500).send('Error removing provider');
    }
});

module.exports = router;