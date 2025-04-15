const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config({ path: './path/to/.env' });

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
    },
};

const apiRoutes = require('./api/index');
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

