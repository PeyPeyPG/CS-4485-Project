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

// Get all patients
router.get('/patients', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT pd.PatientID, pd.Name, pd.DateOfBirth, pd.Gender
            FROM Patients pd
        `);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).send('Error fetching patients');
    }
});

// Get patient details by ID
router.get('/patients/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);
        const patientDetails = await pool.request()
            .input('PatientID', sql.Int, id)
            .query(`
                SELECT pd.Name, pd.DateOfBirth, pd.Gender, pd.Height, pd.Weight, pd.PregnancyStatus
                FROM Patients pd
                WHERE pd.PatientID = @PatientID
            `);

        const medicalConditions = await pool.request()
            .input('PatientID', sql.Int, id)
            .query(`
                SELECT ConditionName
                FROM MedicalConditions
                WHERE PatientID = @PatientID
            `);

        const medications = await pool.request()
            .input('PatientID', sql.Int, id)
            .query(`
                SELECT MedicationName
                FROM Medications
                WHERE PatientID = @PatientID
            `);

        res.status(200).json({
            details: patientDetails.recordset[0],
            conditions: medicalConditions.recordset,
            medications: medications.recordset,
        });
    } catch (err) {
        console.error('Error fetching patient details:', err);
        res.status(500).send('Error fetching patient details');
    }
});

// Get allergies for a specific patient
router.get('/patients/:id/allergies', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);
        const allergies = await pool.request()
            .input('PatientID', sql.Int, id)
            .query(`
                SELECT AllergyName
                FROM Allergies
                WHERE PatientID = @PatientID
            `);

        res.status(200).json(allergies.recordset);
    } catch (err) {
        console.error('Error fetching allergies:', err);
        res.status(500).send('Error fetching allergies');
    }
});

// Link a provider to a patient
router.post('/patients/:id/providers', async (req, res) => {
    const { id } = req.params; // Patient ID
    const { providerName, accessGranted } = req.body;

    try {
        const pool = await sql.connect(config);

        // Check if the provider exists
        const providerResult = await pool.request()
            .input('providerName', sql.NVarChar, providerName)
            .query(`
                SELECT UserID FROM Providers
                WHERE Profession = @providerName
            `);

        let providerId;
        if (providerResult.recordset.length > 0) {
            providerId = providerResult.recordset[0].UserID;
        } else {
            // Add the provider if not in the system
            const newProvider = await pool.request()
                .input('providerName', sql.NVarChar, providerName)
                .input('placeOfWork', sql.NVarChar, 'Unknown')
                .query(`
                    INSERT INTO Providers (Profession, PlaceOfWork)
                    OUTPUT INSERTED.UserID
                    VALUES (@providerName, @placeOfWork)
                `);
            providerId = newProvider.recordset[0].UserID;
        }

        // Link the provider to the patient
        await pool.request()
            .input('PatientID', sql.Int, id)
            .input('ProviderID', sql.Int, providerId)
            .input('AccessGranted', sql.Bit, accessGranted)
            .query(`
                INSERT INTO PatientProviders (PatientID, ProviderID, AccessGranted)
                VALUES (@PatientID, @ProviderID, @AccessGranted)
            `);

        res.status(201).json({ message: 'Provider linked to patient successfully' });
    } catch (err) {
        console.error('Error linking provider to patient:', err);
        res.status(500).send('Error linking provider to patient');
    }
});

module.exports = router;
