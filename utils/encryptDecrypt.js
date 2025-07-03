const crypto = require("crypto");
require("dotenv").config();

const ENCRYPTION_KEY = Buffer.from(process.env.SECRET_KEY, "utf-8"); // 32 bytes
const IV = Buffer.from(process.env.IV_KEY, "utf-8"); // 16 bytes

exports.encrypt = (text) => {
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};

exports.decrypt = (text) => {
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);
    let decrypted = decipher.update(text, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
};



exports.encryptionFunction = function(obj) {
    const jsonString = JSON.stringify(obj);
    return exports.encrypt(jsonString);
};

exports.decryptionFunction= function(encryptedStr) {
    const decryptedString = exports.decrypt(encryptedStr);
    return JSON.parse(decryptedString);
};