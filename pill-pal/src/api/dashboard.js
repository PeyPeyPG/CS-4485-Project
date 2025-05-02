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
    console.log('Route hit');
    console.log('API hit with username:', req.params.username);
    const { username } = req.params;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT pm.MedicationName, pm.Days, pm.Times, m.dosage
            FROM PatientMedications pm JOIN Medications m ON pm.MedicationName = m.medicationName
            WHERE pm.PatientUsername = '${username}'
        `);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching patients medications:', err);
        res.status(500).send('Error fetching patients medications');
    }
});

module.exports = router;