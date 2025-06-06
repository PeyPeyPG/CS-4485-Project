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

// Get patient details by username
router.get('/patients/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .query(`
                SELECT
                    p.Name,
                    p.DateOfBirth,
                    p.Gender,
                    p.Height,
                    p.Weight,
                    p.PregnancyStatus,
                    p.username
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
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('patientUsername', sql.NVarChar(255), username)
            .query(`
                SELECT
                    pp.providerUsername AS username,
                    pr.Name,
                    pr.profession,
                    pr.placeOfWork
                FROM Providers pr
                JOIN PatientProviders pp ON pp.providerUsername = pr.username
                WHERE pp.patientUsername = @patientUsername
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching providers:', err);
        res.status(500).send('Error fetching providers');
    }
});

// Add a new provider for a patient
router.post('/:username/addprovider', async (req, res) => {
    const { username } = req.params;
    const { providerUsername } = req.body;

    if (!providerUsername) {
        return res.status(400).json({ error: 'Provider username is required' });
    }

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('patientUsername', sql.NVarChar(255), username)
            .input('providerUsername', sql.NVarChar(255), providerUsername)
            .query(`
                INSERT INTO PatientProviders (patientUsername, providerUsername)
                VALUES (@patientUsername, @providerUsername)
            `);

        res.status(201).json({ message: 'Provider added successfully' });
    } catch (err) {
        console.error('Error adding provider:', err);
        res.status(500).send('Error adding provider');
    }
});

// Delete a provider for a patient
router.delete('/:username/remove/:providerUsername', async (req, res) => {
    const { username, providerUsername } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('patientUsername', sql.NVarChar(255), username)
            .input('providerUsername', sql.NVarChar(255), providerUsername)
            .query(`
                DELETE FROM PatientProviders
                WHERE patientUsername = @patientUsername AND providerUsername = @providerUsername
            `);
        res.status(200).json({ message: 'Provider removed successfully' });
    } catch (err) {
        console.error('Error removing provider:', err);
        res.status(500).send('Error removing provider');
    }
});

router.get('/:username/requested-providers', async (req, res) => {
    const { username } = req.params;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('patientUsername', sql.NVarChar(255), username)
            .query(`
                SELECT
                    rp.providerUsername AS username,
                    pr.Name
                FROM RequestedPatients rp
                JOIN Providers pr ON rp.providerUsername = pr.username
                WHERE rp.patientUsername = @patientUsername
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching requested providers:', err);
        res.status(500).send('Error fetching requested providers');
    }
});

router.delete('/:username/requested-providers/:providerUsername', async (req, res) => {
    const { username, providerUsername } = req.params;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('patientUsername', sql.NVarChar(255), username)
            .input('providerUsername', sql.NVarChar(255), providerUsername)
            .query(`
                DELETE FROM RequestedPatients
                WHERE patientUsername = @patientUsername AND providerUsername = @providerUsername
            `);
        res.status(200).json({ message: 'Request removed successfully' });
    } catch (err) {
        console.error('Error removing request:', err);
        res.status(500).send('Error removing request');
    }
});

router.post('/:username/accept-request/:providerUsername', async (req, res) => {
    const { username, providerUsername } = req.params;
    try {
        const pool = await sql.connect(config);

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            await transaction.request()
                .input('patientUsername', sql.NVarChar(255), username)
                .input('providerUsername', sql.NVarChar(255), providerUsername)
                .query(`
                    INSERT INTO PatientProviders (patientUsername, providerUsername)
                    VALUES (@patientUsername, @providerUsername)
                `);

            await transaction.request()
                .input('patientUsername', sql.NVarChar(255), username)
                .input('providerUsername', sql.NVarChar(255), providerUsername)
                .query(`
                    DELETE FROM RequestedPatients
                    WHERE patientUsername = @patientUsername AND providerUsername = @providerUsername
                `);

            await transaction.commit();
            res.status(200).json({ message: 'Request accepted and provider added.' });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        console.error('Error accepting provider request:', err);
        res.status(500).send('Error accepting provider request');
    }
});

module.exports = router;