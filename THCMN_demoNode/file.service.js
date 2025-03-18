require("dotenv").config();
const { s3 } = require("./aws.helper");

const randomString = (numberCharacter) => {
    return `${Math.random()
        .toString(36)
        .substring(2, numberCharacter +2)}`;
};