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
    const {
        username, email, password, userType,
        name, dateOfBirth, gender, height, weight, pregnancyStatus,
        profession, placeOfWork
    } = req.body;

    try {
        const pool = await sql.connect(config);

        // Insert into Users table
        await pool.request()
            .input('username', sql.NVarChar(255), username)
            .input('email', sql.NVarChar(255), email)
            .input('password', sql.NVarChar(255), password)
            .input('userType', sql.NVarChar(20), userType)
            .query(`
                INSERT INTO Users (username, email, password, userType)
                VALUES (@username, @email, @password, @userType)
            `);

        // Insert into Patients or Providers table based on userType
        if (userType === 'patient') {
            await pool.request()
                .input('username', sql.NVarChar(255), username)
                .input('name', sql.NVarChar(100), name)
                .input('dateOfBirth', sql.Date, dateOfBirth)
                .input('gender', sql.NVarChar(10), gender)
                .input('height', sql.Decimal(5, 2), height)
                .input('weight', sql.Decimal(5, 2), weight)
                .input('pregnancyStatus', sql.Bit, pregnancyStatus)
                .query(`
                    INSERT INTO Patients (username, Name, DateOfBirth, Gender, Height, Weight, PregnancyStatus)
                    VALUES (@username, @name, @dateOfBirth, @gender, @height, @weight, @pregnancyStatus)
                `);
        } else if (userType === 'provider') {
            await pool.request()
                .input('username', sql.NVarChar(255), username)
                .input('profession', sql.NVarChar(100), profession)
                .input('placeOfWork', sql.NVarChar(255), placeOfWork)
                .query(`
                    INSERT INTO Providers (username, profession, placeOfWork)
                    VALUES (@username, @profession, @placeOfWork)
                `);
        }

        res.status(201).json({ message: 'User registered successfully', userType });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await sql.connect(config);

        // Fetch user details
        const result = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .query(`
                SELECT username, password, userType
                FROM Users
                WHERE username = @username
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.recordset[0];
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', userType: user.userType });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).send('Error logging in user');
    }
});

// Logout route
router.post('/logout', (req, res) => {
    res.clearCookie('user');
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;