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

router.get('/search', async (req, res) => {
    const { q } = req.query;      // ?q=asp
    if (!q || q.trim() === '') {
        return res.status(400).json({ error: 'Query parameter `q` is required' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('query', sql.NVarChar(100), `%${q}%`)
            .query(`
                SELECT TOP 20 medicationName, dosage
                FROM Medications
                WHERE medicationName LIKE @query
                ORDER BY medicationName
            `);

        res.status(200).json(result.recordset);   // [{ medicationName, dosage }]
    } catch (err) {
        console.error('Error searching medications:', err);
        res.status(500).send('Error searching medications');
    }
});

// Add a new medication
router.post('/', async (req, res) => {
    const { medicationName, dosage, Days, Times, PatientUsername, Frequency } = req.body;

    if (!medicationName || !dosage || !Days || !Times || !PatientUsername || !Frequency) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('medicationName', sql.NVarChar(100), medicationName)
            .input('dosage', sql.NVarChar(50), dosage)
            .input('Days', sql.NVarChar(50), Days)
            .input('Times', sql.NVarChar(sql.MAX), Times)
            .input('PatientUsername', sql.NVarChar(255), PatientUsername)
            .input('Frequency', sql.Int, Frequency)
            .query(`
                INSERT INTO PatientMedications (MedicationName, Dosage, Days, Times, PatientUsername, Frequency)
                VALUES (@medicationName, @dosage, @Days, @Times, @PatientUsername, @Frequency)
            `);

        res.status(201).json({ message: 'Medication added successfully' });
    } catch (err) {
        console.error('Error adding medication:', err);
        res.status(500).send('Error adding medication');
    }
});

// Get all medications for a patient
router.get('/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('PatientUsername', sql.NVarChar(255), username)
            .query(`
                SELECT
                    pm.MedicationName AS medicationName,
                    m.dosage AS dosage,
                    pm.Days AS days,
                    pm.Times AS times,
                    pm.Frequency AS frequency
                FROM PatientMedications pm
                         INNER JOIN Medications m ON pm.MedicationName = m.medicationName
                WHERE pm.PatientUsername = @PatientUsername
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching medications for patient:', err);
        res.status(500).send('Error fetching medications');
    }
});

// Assign medication to a patient
router.post('/assign', async (req, res) => {
    const { PatientUsername, MedicationName, Days, Times, Frequency, dosage } = req.body;

    if (!PatientUsername || !MedicationName || !Days || !Times || !Frequency || !dosage) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const pool = await sql.connect(config);

        // Check if the medication exists in the Medications table
        const medicationExists = await pool.request()
            .input('MedicationName', sql.NVarChar(100), MedicationName)
            .query(`
                SELECT 1 FROM Medications WHERE medicationName = @MedicationName
            `);

        // If the medication does not exist, insert it
        if (medicationExists.recordset.length === 0) {
            await pool.request()
                .input('MedicationName', sql.NVarChar(100), MedicationName)
                .input('dosage', sql.NVarChar(50), dosage)
                .query(`
                    INSERT INTO Medications (medicationName, dosage)
                    VALUES (@MedicationName, @dosage)
                `);
        }

        // Then insert into PatientMedications
        await pool.request()
            .input('PatientUsername', sql.NVarChar(255), PatientUsername)
            .input('MedicationName', sql.NVarChar(100), MedicationName)
            .input('Days', sql.NVarChar(50), Days)
            .input('Times', sql.NVarChar(sql.MAX), Times)
            .input('Frequency', sql.Int, Frequency)
            .query(`
                INSERT INTO PatientMedications (PatientUsername, MedicationName, Days, Times, Frequency)
                VALUES (@PatientUsername, @MedicationName, @Days, @Times, @Frequency)
            `);

        res.status(201).json({ message: 'Medication assigned successfully' });
    } catch (err) {
        console.error('Error assigning medication:', err);
        res.status(500).send('Error assigning medication');
    }
});

// Delete a medication
router.delete('/:medicationName/:username', async (req, res) => {
    const { medicationName, username } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('MedicationName', sql.NVarChar(100), medicationName)
            .input('PatientUsername', sql.NVarChar(255), username)
            .query(`
                DELETE FROM PatientMedications
                WHERE MedicationName = @MedicationName AND PatientUsername = @PatientUsername
            `);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Medication deleted successfully' });
        } else {
            res.status(404).json({ error: 'Medication not found' });
        }
    } catch (err) {
        console.error('Error deleting medication:', err);
        res.status(500).send('Error deleting medication');
    }
});

// All interactions present in the patient’s current stack
router.get('/interactions/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .query(`
                SELECT DISTINCT mi.MedicationA, mi.MedicationB
                FROM MedicationInteractions mi
                JOIN PatientMedications pmA
                     ON pmA.MedicationName = mi.MedicationA
                    AND pmA.PatientUsername = @username
                JOIN PatientMedications pmB
                     ON pmB.MedicationName = mi.MedicationB
                    AND pmB.PatientUsername = @username
            `);
        res.status(200).json(result.recordset);     // [{ MedicationA, MedicationB }]
    } catch (err) {
        console.error('Error fetching interactions: ', err);
        res.status(500).send('Error fetching interactions');
    }
});

// Interactions caused by adding ONE extra drug
router.get('/interactions/:username/check/:drug', async (req, res) => {
    const { username, drug } = req.params;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .input('drug', sql.NVarChar(100), drug)
            .query(`
                SELECT mi.MedicationA, mi.MedicationB
                FROM MedicationInteractions mi
                WHERE  (mi.MedicationA = @drug AND mi.MedicationB IN
                            (SELECT MedicationName FROM PatientMedications WHERE PatientUsername = @username))
                    OR (mi.MedicationB = @drug AND mi.MedicationA IN
                            (SELECT MedicationName FROM PatientMedications WHERE PatientUsername = @username))
            `);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error checking interactions: ', err);
        res.status(500).send('Error checking interactions');
    }
});

module.exports = router;