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
        console.error('Error fetching providers:', err);
        res.status(500).send('Error fetching providers');
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

module.exports = router;