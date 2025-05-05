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

router.post('/logactivity', async (req, res) => {
    const { username, action, target, targetId } = req.body;

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('username', sql.NVarChar(255), username)
            .input('action', sql.NVarChar(50), action)      // 'view', 'edit', etc
            .input('target', sql.NVarChar(255), target)     // 'PatientProfile', 'Medication', etc
            .input('targetId', sql.NVarChar(255), targetId) // ID of the target (username, medicationname, etc)
            .query(`
                INSERT INTO ActivityLog (username, action, target, targetId)
                VALUES (@username, @action, @target, @targetId)
            `);

        res.status(200).json({ message: 'Activity logged successfully' });
    } catch (err) {
        console.error('Error logging activity:', err);
        res.status(500).send('Error logging activity');
    }
});

module.exports = router;