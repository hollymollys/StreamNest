/*
====================================================
StreamNest
config/db.js — MySQL / RDS Connection
====================================================
*/

'use strict';

const mysql = require('mysql2/promise');

/*
====================================================
Connection Pool
====================================================
A pool keeps several connections open and reuses
them so the app does not open a new connection on
every request.
====================================================
*/

const pool = mysql.createPool({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0
});

/*
====================================================
Test Connection
====================================================
*/

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
}

testConnection();

module.exports = pool;
