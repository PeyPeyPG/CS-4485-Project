const express = require('express');
const sql = require('mssql');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY || 'a32characterlongencryptionkey!*&!').padEnd(32, '0').slice(0, 32); // 32 chars
const IV_LENGTH = 16;

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}
function decrypt(text) {
    let parts = text.split(':');
    let iv = Buffer.from(parts.shift(), 'hex');
    let encryptedText = parts.join(':');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

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

        // Check if username or email already exists
        const existingUser = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .input('email', sql.NVarChar(255), email)
            .query(`
                SELECT username, email
                FROM Users
                WHERE username = @username OR email = @email
            `);

        if (existingUser.recordset.length > 0) {
            const existing = existingUser.recordset[0];
            if (existing.username === username) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            if (existing.email === email) {
                return res.status(400).json({ error: 'Email already exists' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into Users table
        await pool.request()
            .input('username', sql.NVarChar(255), username)
            .input('email', sql.NVarChar(255), email)
            .input('password', sql.NVarChar(255), hashedPassword)
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
                .input('name', sql.NVarChar(100), name)
                .input('profession', sql.NVarChar(100), profession)
                .input('placeOfWork', sql.NVarChar(255), placeOfWork)
                .query(`
                    INSERT INTO Providers (username, name, profession, placeOfWork)
                    VALUES (@username, @name, @profession, @placeOfWork)
                `);
        }

        res.status(201).json({ message: 'User registered successfully', userType });
    } catch (err) {
        console.error('Error during registration:', err);

        // Return specific SQL error if available
        if (err.originalError && err.originalError.info) {
            return res.status(500).json({ error: err.originalError.info.message });
        }

        res.status(500).json({ error: 'Registration failed due to an unexpected error' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await sql.connect(config);

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
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
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