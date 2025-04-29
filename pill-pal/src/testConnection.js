const sql = require('mssql');
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

console.log('Current Directory:', __dirname);
console.log('DB_SERVER:', process.env.DB_SERVER);

async function testConnection() {
    try {
        const pool = await sql.connect(config);
        console.log('Connected to the database successfully!');
        pool.close();
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

testConnection();