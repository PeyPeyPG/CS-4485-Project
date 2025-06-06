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

//get patients linked to a provider
router.get('/patients/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('providerUsername', sql.NVarChar(255), username)
            .query(`
                SELECT
                    p.username,
                    p.Name,
                    p.Gender,
                    p.DateOfBirth
                FROM PatientProviders pp
                INNER JOIN Patients p
                    ON pp.patientUsername = p.username
                WHERE pp.providerUsername = @providerUsername
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).send('Error fetching patients');
    }
});

// Adds a note to the database
router.post('/writenote', async (req, res) => {
    const { username, patientUsername, subject, note } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('providerUsername', sql.NVarChar(255), username)
            .input('patientUsername', sql.NVarChar(255), patientUsername)
            .input('subject', sql.NVarChar(255), subject)
            .input('note', sql.NVarChar(sql.MAX), note)
            .query(`
                INSERT INTO DoctorsNotes (providerUsername, patientUsername, subject, note)
                VALUES (@providerUsername, @patientUsername, @subject, @note)
            `);

        res.status(200).json({ message: 'Note written successfully' });
    }
    catch (err) {
        console.error('Error writing note:', err);
        res.status(500).send('Error writing note');
    }
});

// Get all providers
router.get('/providers', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT
                pr.Name,
                pr.profession,
                pr.placeOfWork,
                pr.username
            FROM Providers pr
        `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching all providers:', err);
        res.status(500).send('Error fetching all providers');
    }
});

// Delete a patient for a provider
router.delete('/deletepatient', async (req, res) => {
    const { providerUsername, patientUsername } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('providerUsername', sql.NVarChar(255), providerUsername)
            .input('patientUsername', sql.NVarChar(255), patientUsername)
            .query(`
                DELETE FROM PatientProviders
                WHERE providerUsername = @providerUsername AND patientUsername = @patientUsername
            `);

        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (err) {
        console.error('Error deleting patient:', err);
        res.status(500).send('Error deleting patient');
    }
});

router.post('/requestaccess', async (req, res) => {
    const { providerUsername, patientUsername } = req.body;
    if (!providerUsername || !patientUsername) {
        return res.status(400).json({ message: 'Missing providerUsername or patientUsername' });
    }
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('providerUsername', sql.NVarChar(255), providerUsername)
            .input('patientUsername', sql.NVarChar(255), patientUsername)
            .query(`
                INSERT INTO RequestedPatients (providerUsername, patientUsername)
                VALUES (@providerUsername, @patientUsername)
            `);

        res.status(200).json({ message: 'Access request submitted successfully' });
    } catch (err) {
        console.error('Error requesting access:', err);
        res.status(500).send('Error requesting access');
    }
});

// Get all requested patients for a provider
router.get('/requestedpatients/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('providerUsername', sql.NVarChar(255), username)
            .query(`
               SELECT
                    p.username,
                    p.Name,
                    p.Gender,
                    p.DateOfBirth
                FROM RequestedPatients rp
                INNER JOIN Patients p
                    ON rp.patientUsername = p.username
                WHERE rp.providerUsername = @providerUsername
            `);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching requested patients:', err);
        res.status(500).send('Error fetching requested patients');
    }
}
);


module.exports = router;