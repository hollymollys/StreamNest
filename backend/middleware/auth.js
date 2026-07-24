/*
====================================================
StreamNest
middleware/auth.js — JWT Token Verification
====================================================
Every protected route passes through this first.
If the token is missing or invalid, the request
is blocked before it reaches the route handler.
====================================================
*/

'use strict';

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {

    // Get the Authorization header: "Bearer <token>"
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            message: 'Access denied. No token provided.'
        });
    }

    // Strip the "Bearer " prefix
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. Token malformed.'
        });
    }

    try {
        // Verify the token using the secret from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user payload to the request
        req.user = decoded;

        // Pass control to the next middleware or route
        next();

    } catch (error) {
        return res.status(403).json({
            message: 'Invalid or expired token. Please log in again.'
        });
    }
}

module.exports = verifyToken;
