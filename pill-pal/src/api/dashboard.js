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
//get the patients medication
router.get('/getcurmeds/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query(`
            SELECT pm.MedicationName, pm.Days, pm.Times, m.dosage
            FROM PatientMedications pm JOIN Medications m ON pm.MedicationName = m.medicationName
            WHERE pm.PatientUsername = @username
        `);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching patients\' medications:', err);
        res.status(500).send('Error fetching patients\' medications');
    }
});

router.get('/getprofile/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query(`
                SELECT u.username, u.email, p.Name, p.DateOfBirth, p.Height, p.Weight
                FROM Users u JOIN Patients p ON u.username = p.username
                WHERE u.username = @username
                `);
            res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching patients\' profile:', err);
        res.status(500).send('Error fetching patients\' profile');
    }
});

router.get('/getnotes/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query(`
                SELECT d.providerUsername AS name, d.subject, d.note, d.pinned
                FROM DoctorsNotes d
                WHERE d.patientUsername = @username
                `);
            res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching the patients\' doctor\'s notes:', err);
        res.status(500).send('Error fetching the patients\' doctor\'s notes');
    }
});

router.get('/getpinnednotes/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query(`
                SELECT d.providerUsername AS name, d.subject, d.note, d.pinned
                FROM DoctorsNotes d
                WHERE d.patientUsername = @username AND d.pinned = 1
                `);
            res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching the patients\' doctor\'s notes:', err);
        res.status(500).send('Error fetching the patients\' doctor\'s notes');
    }
});

router.put('/changepin/:username/:providerUsername/:subject/', async (req, res) => {
    const { username, providerUsername, subject } = req.params;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('providerUsername', sql.NVarChar, providerUsername)
            .input('subject', sql.NVarChar, subject)
            .query(`
                UPDATE DoctorsNotes
                SET pinned = ~pinned
                WHERE patientUsername = @username AND providerUsername = @providerUsername AND subject = @subject
                `);
            res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error changing the pin status of the doctor\'s note:', err);
        res.status(500).send('Error changing the pin status of the doctor\'s note');
    }
});


router.delete('/removenote/:username/:providerUsername/:subject/', async (req, res) => {
    const { username, providerUsername, subject } = req.params;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('username', sql.NVarChar, username)
            .input('providerUsername', sql.NVarChar, providerUsername)
            .input('subject', sql.NVarChar, subject)
            .query(`
                DELETE FROM DoctorsNotes
                WHERE patientUsername = @username
                  AND providerUsername = @providerUsername
                  AND subject = @subject
                `);
            res.status(200).json({message: 'Note deleted successfully'});
    } catch (err) {
        console.error('Error deleting the doctor\'s note:', err);
        res.status(500).send('Error deleting the doctor\'s note:');
    }
});

module.exports = router;