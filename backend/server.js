/*
====================================================
StreamNest Backend
server.js — Main Entry Point
====================================================
*/

'use strict';

const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const path       = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();

/*
====================================================
Middleware
====================================================
*/

// Allow frontend to call this backend
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..')));

/*
====================================================
Routes
====================================================
*/

const authRoutes      = require('./routes/auth');
const videoRoutes     = require('./routes/videos');
const userRoutes      = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/auth',      authRoutes);
app.use('/api/videos',    videoRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/dashboard', dashboardRoutes);

/*
====================================================
Health Check
====================================================
*/

app.get('/api/health', (req, res) => {
    res.json({
        status:  'ok',
        message: 'StreamNest backend is running',
        time:    new Date().toISOString()
    });
});

/*
====================================================
Catch-All — Serve Frontend
====================================================
*/

app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

/*
====================================================
Start Server
====================================================
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`StreamNest server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

