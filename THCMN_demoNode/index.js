const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const upload = multer(); // Không lưu file vào thư mục tạm thời
const path = require('path');
require('dotenv').config()
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./views'));

app.set("view engine", "ejs");
app.set("views", "./views");

AWS.config.update({
    region: 'ap-southeast-1',
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
});

const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const bucketName = 'nodebucketcnm203';
const tableName = 'SamPham';

app.get("/", async(req, res) => {
    const params = {
        TableName: tableName
    };
    dynamoDB.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).send("Error scanning table");
        } else {
            res.render("index", { subjects: data.Items });
        }
    });
});



app.post("/upload", upload.single('image'), async(req, res) => {
    const id = Number(req.body.id);
    const name = req.body.name;
    const description = req.body.description;
    const fileContent = req.file.buffer;
    const fileName = `${Date.now()}_${path.basename(req.file.originalname)}`;

    const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
        ContentType: req.file.mimetype
    };

    s3.upload(uploadParams, (err, data) => {
        if (err) {
            console.error("Error uploading file. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).send("Error uploading file");
        } else {
            const imageUrl = data.Location;
            const params = {
                TableName: tableName,
                Item: {
                    id: id,
                    name: name,
                    description: description,
                    image: imageUrl
                }
            };
            dynamoDB.put(params, (err, data) => {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    res.status(500).send("Error adding data");
                } else {
                    res.redirect("/");
                }
            });
        }
    });
});

app.delete('/delete/:id', async(req, res) => {
    const id = Number(req.params.id);

    const params = {
        TableName: tableName,
        Key: {
            id: id
        }
    };
    dynamoDB.delete(params, (err, data) => {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).send("Error deleting data");
        } else {
            res.status(200).send("Delete data successfully");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});