/*
====================================================
StreamNest
routes/dashboard.js — Dashboard Statistics
====================================================
GET /api/dashboard/stats    — User stats
GET /api/dashboard/activity — Recent activity log
====================================================
*/

'use strict';

const express     = require('express');
const pool        = require('../config/db');
const verifyToken = require('../middleware/auth');

const router = express.Router();

/*
====================================================
GET /api/dashboard/stats
====================================================
Returns: video count, total views, followers, storage
====================================================
*/

router.get('/stats', verifyToken, async (req, res) => {

    try {

        // Total videos uploaded by this user
        const [videoResult] = await pool.execute(
            'SELECT COUNT(*) AS total FROM media WHERE user_id = ?',
            [req.user.id]
        );

        // Total views across all videos
        const [viewResult] = await pool.execute(
            'SELECT COALESCE(SUM(view_count), 0) AS total FROM media WHERE user_id = ?',
            [req.user.id]
        );

        // Total storage used in bytes
        const [storageResult] = await pool.execute(
            'SELECT COALESCE(SUM(file_size), 0) AS total FROM media WHERE user_id = ?',
            [req.user.id]
        );

        // Followers count
        const [followerResult] = await pool.execute(
            'SELECT COUNT(*) AS total FROM followers WHERE following_id = ?',
            [req.user.id]
        );

        // Format storage into readable string
        const bytes    = storageResult[0].total;
        const mb       = bytes / (1024 * 1024);
        const gb       = mb / 1024;
        const storage  = gb >= 1
            ? `${gb.toFixed(1)} GB`
            : `${mb.toFixed(0)} MB`;

        // Format view count
        const views    = viewResult[0].total;
        const viewsFormatted = views >= 1000
            ? `${(views / 1000).toFixed(1)}K`
            : views.toString();

        return res.status(200).json({
            stats: {
                videos:    videoResult[0].total,
                views:     viewsFormatted,
                followers: followerResult[0].total,
                storage
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        return res.status(500).json({
            message: 'Failed to load stats.'
        });
    }
});

/*
====================================================
GET /api/dashboard/activity
====================================================
Returns: last 10 activity log entries
====================================================
*/

router.get('/activity', verifyToken, async (req, res) => {

    try {

        const [activity] = await pool.execute(
            `SELECT action, description, created_at
             FROM activity_log
             WHERE user_id = ?
             ORDER BY created_at DESC
             LIMIT 10`,
            [req.user.id]
        );

        return res.status(200).json({ activity });

    } catch (error) {
        console.error('Activity log error:', error);
        return res.status(500).json({
            message: 'Failed to load activity.'
        });
    }
});

module.exports = router;
