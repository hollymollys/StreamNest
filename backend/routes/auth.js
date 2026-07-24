/*
====================================================
StreamNest
routes/auth.js — Register and Login
====================================================
POST /api/auth/register
POST /api/auth/login
====================================================
*/

'use strict';

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const pool     = require('../config/db');

const router = express.Router();

/*
====================================================
POST /api/auth/register
====================================================
1. Validate inputs
2. Check if email already exists
3. Hash the password
4. Insert new user into RDS
5. Return success
====================================================
*/

router.post('/register', async (req, res) => {

    try {

        const { fullname, username, email, password } = req.body;

        // Basic validation
        if (!fullname || !username || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters.'
            });
        }

        // Check if email already registered
        const [existingUser] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: 'An account with this email already exists.'
            });
        }

        // Check if username taken
        const [existingUsername] = await pool.execute(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (existingUsername.length > 0) {
            return res.status(409).json({
                message: 'This username is already taken.'
            });
        }

        // Hash password — never store plain text
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert user into database
        const [result] = await pool.execute(
            `INSERT INTO users
                (fullname, username, email, password, account_type, created_at)
             VALUES (?, ?, ?, ?, 'creator', NOW())`,
            [fullname, username, email, hashedPassword]
        );

        return res.status(201).json({
            message: 'Account created successfully. Please log in.'
        });

    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({
            message: 'Server error. Please try again.'
        });
    }
});

/*
====================================================
POST /api/auth/login
====================================================
1. Find user by email in RDS
2. Compare password with bcrypt
3. Generate JWT token
4. Return token and user info
====================================================
*/

router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required.'
            });
        }

        // Find user by email
        const [users] = await pool.execute(
            `SELECT id, fullname, username, email,
                    password, account_type, created_at
             FROM users WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const user = users[0];

        // Compare submitted password with stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        // Generate JWT token — expires in 7 days
        const token = jwt.sign(
            {
                id:           user.id,
                email:        user.email,
                username:     user.username,
                account_type: user.account_type
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id:           user.id,
                fullname:     user.fullname,
                username:     user.username,
                email:        user.email,
                account_type: user.account_type,
                created_at:   user.created_at
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: 'Server error. Please try again.'
        });
    }
});

module.exports = router;
