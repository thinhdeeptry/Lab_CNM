require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION
});

const s3 = new AWS.S3(); // tao s3 service
const dynamodb = new AWS.DynamoDB.DocumentClient(); //tao dynamodb


module.exports = { s3, dynamodb };