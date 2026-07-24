/*
====================================================
StreamNest
routes/users.js — User Profile
====================================================
GET /api/users/me      — Get current user profile
PUT /api/users/me      — Update profile
====================================================
*/

'use strict';

const express     = require('express');
const pool        = require('../config/db');
const verifyToken = require('../middleware/auth');

const router = express.Router();

/*
====================================================
GET /api/users/me
====================================================
*/

router.get('/me', verifyToken, async (req, res) => {

    try {

        const [users] = await pool.execute(
            `SELECT id, fullname, username, email,
                    bio, phone, country, profile_photo,
                    account_type, created_at
             FROM users WHERE id = ?`,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        return res.status(200).json({ user: users[0] });

    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({
            message: 'Failed to load profile.'
        });
    }
});

/*
====================================================
PUT /api/users/me
====================================================
*/

router.put('/me', verifyToken, async (req, res) => {

    try {

        const { fullname, username, bio, phone, country } = req.body;

        if (!fullname || !username) {
            return res.status(400).json({
                message: 'Full name and username are required.'
            });
        }

        // Check username not taken by another user
        const [existing] = await pool.execute(
            'SELECT id FROM users WHERE username = ? AND id != ?',
            [username, req.user.id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: 'This username is already taken.'
            });
        }

        await pool.execute(
            `UPDATE users
             SET fullname = ?, username = ?,
                 bio = ?, phone = ?, country = ?
             WHERE id = ?`,
            [fullname, username, bio || '', phone || '', country || '', req.user.id]
        );

        // Return updated user
        const [users] = await pool.execute(
            `SELECT id, fullname, username, email,
                    bio, phone, country, account_type
             FROM users WHERE id = ?`,
            [req.user.id]
        );

        return res.status(200).json({
            message: 'Profile updated successfully.',
            user: users[0]
        });

    } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({
            message: 'Failed to update profile.'
        });
    }
});

module.exports = router;
