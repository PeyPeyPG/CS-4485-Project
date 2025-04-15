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
// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password, userType, name, dateOfBirth, gender, height, weight, pregnancyStatus, profession, placeOfWork } = req.body;

    try {
        const pool = await sql.connect(config);

        // Insert into Users table
        const userResult = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .input('userType', sql.NVarChar, userType)
            .query(`
                INSERT INTO Users (username, email, password, userType)
                OUTPUT INSERTED.ID
                VALUES (@username, @email, @password, @userType)
            `);

        const userId = userResult.recordset[0].ID;

        // Insert into PatientDetails or Providers based on userType
        if (userType === 'patient') {
            await pool.request()
                .input('UserID', sql.Int, userId)
                .input('Name', sql.NVarChar, name)
                .input('DateOfBirth', sql.Date, dateOfBirth)
                .input('Gender', sql.NVarChar, gender)
                .input('Height', sql.Decimal(5, 2), height)
                .input('Weight', sql.Decimal(5, 2), weight)
                .input('PregnancyStatus', sql.Bit, pregnancyStatus)
                .query(`
                    INSERT INTO Patients (UserID, Name, DateOfBirth, Gender, Height, Weight, PregnancyStatus)
                    VALUES (@UserID, @Name, @DateOfBirth, @Gender, @Height, @Weight, @PregnancyStatus)
                `);
        } else if (userType === 'provider') {
            await pool.request()
                .input('UserID', sql.Int, userId)
                .input('Profession', sql.NVarChar, profession)
                .input('PlaceOfWork', sql.NVarChar, placeOfWork)
                .query(`
                    INSERT INTO Providers (UserID, Profession, PlaceOfWork)
                    VALUES (@UserID, @Profession, @PlaceOfWork)
                `);
        }

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