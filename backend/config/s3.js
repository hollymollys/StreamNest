/*
====================================================
StreamNest
config/s3.js — AWS S3 Configuration
====================================================
*/

'use strict';

const AWS = require('aws-sdk');

/*
====================================================
Configure AWS SDK
====================================================
On EC2 with an IAM Role attached, you do NOT need
to provide accessKeyId or secretAccessKey here.
AWS automatically picks up the role credentials.

For local development, use a .env file with your
AWS credentials.
====================================================
*/

AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

/*
====================================================
Upload File to S3
====================================================
*/

async function uploadToS3(file, folder = 'uploads') {

    const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

    const params = {
        Bucket:      BUCKET_NAME,
        Key:         fileName,
        Body:        file.buffer,
        ContentType: file.mimetype
    };

    const result = await s3.upload(params).promise();

    return {
        key: result.Key,
        url: result.Location
    };
}

/*
====================================================
Delete File from S3
====================================================
*/

async function deleteFromS3(key) {

    const params = {
        Bucket: BUCKET_NAME,
        Key:    key
    };

    await s3.deleteObject(params).promise();
}

module.exports = {
    s3,
    uploadToS3,
    deleteFromS3,
    BUCKET_NAME
};
