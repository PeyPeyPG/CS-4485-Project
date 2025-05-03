const sql = require('mssql');
const config = require('../server').config;

const logActivity = async (username, action, target, targetId = null) => {
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
    } catch (err) {
        console.error('Error logging activity:', err);
    }
};

module.exports = logActivity;