require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: 'ap-southeast-2'
});

const dynamodb = new AWS.DynamoDB.DocumentClient(); //tao dynamodb
const s3 = new AWS.S3(); // tao s3 service

module.exports = { s3, dynamodb };