const express = require('express');
const sql = require('mssql');
const router = express.Router();
require('dotenv').config();

// Database configuration
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
    },
};

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password, userType } = req.body;

    try {
        console.log('Connecting to the database...');
        const pool = await sql.connect(config);
        console.log('Connected to the database.');

        console.log('Inserting user into the database...');
        await pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .input('userType', sql.NVarChar, userType)
            .query(`
                INSERT INTO Users (username, email, password, userType)
                VALUES (@username, @email, @password, @userType)
            `);
        console.log('User registered successfully.');
        res.status(201).json({ message: 'User registered successfully', userType });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Log in a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .query(`
                SELECT * FROM Users WHERE username = @username AND password = @password
            `);

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
    }
});

module.exports = router;