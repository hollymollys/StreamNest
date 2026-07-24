-- ====================================================
-- StreamNest Database Schema
-- Run this once on your RDS instance to create
-- all required tables
-- ====================================================

-- Create the database
CREATE DATABASE IF NOT EXISTS streamnest;
USE streamnest;

-- ====================================================
-- users table
-- Stores all registered creator accounts
-- ====================================================

CREATE TABLE IF NOT EXISTS users (
    id            INT           AUTO_INCREMENT PRIMARY KEY,
    fullname      VARCHAR(150)  NOT NULL,
    username      VARCHAR(80)   NOT NULL UNIQUE,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password      VARCHAR(255)  NOT NULL,
    bio           TEXT,
    phone         VARCHAR(30),
    country       VARCHAR(80),
    profile_photo VARCHAR(500),
    account_type  VARCHAR(30)   DEFAULT 'creator',
    created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      ON UPDATE CURRENT_TIMESTAMP
);

-- ====================================================
-- media table
-- Stores metadata for every uploaded video or image
-- The actual file lives in S3 (s3_key + s3_url)
-- ====================================================

CREATE TABLE IF NOT EXISTS media (
    id          INT           AUTO_INCREMENT PRIMARY KEY,
    user_id     INT           NOT NULL,
    title       VARCHAR(200)  NOT NULL,
    description TEXT,
    category    VARCHAR(80),
    visibility  VARCHAR(20)   DEFAULT 'public',
    upload_type VARCHAR(20)   DEFAULT 'video',
    s3_key      VARCHAR(500)  NOT NULL,
    s3_url      VARCHAR(1000) NOT NULL,
    file_size   BIGINT        DEFAULT 0,
    mime_type   VARCHAR(100),
    view_count  INT           DEFAULT 0,
    created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ====================================================
-- followers table
-- Tracks who follows who
-- ====================================================

CREATE TABLE IF NOT EXISTS followers (
    id           INT      AUTO_INCREMENT PRIMARY KEY,
    follower_id  INT      NOT NULL,
    following_id INT      NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_follow (follower_id, following_id),
    FOREIGN KEY (follower_id)  REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ====================================================
-- activity_log table
-- Records user actions for the dashboard feed
-- ====================================================

CREATE TABLE IF NOT EXISTS activity_log (
    id          INT          AUTO_INCREMENT PRIMARY KEY,
    user_id     INT          NOT NULL,
    action      VARCHAR(80)  NOT NULL,
    description VARCHAR(500),
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ====================================================
-- Verify tables created
-- ====================================================

SHOW TABLES;
