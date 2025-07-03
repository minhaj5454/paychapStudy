const UserService = require('../service/users/usersService');
const { UserSchema } = require('../modules/validation/users');
const { validate } = require('../modules/validation/validate');
const Tools = require("../modules/tools");
const getPresignedUrl = require('../middlewares/S3/s3-presignedUrl');

const registration = async (req, res, next) => {
    try {
        validate(UserSchema.POST, req.body);
        const body = req.body;
        const otp = Tools.generate6DigitOTP();
        const token = Tools.generateJWT('15m', { email: req.body.email });
        body.token = {
            accessToken: token,
            fcmToken: null
        };
        body.otp = otp;
        const user = await UserService.create(body);
        res.send(user);
        // if (user) //send OTP for verification. 
    } catch (error) {
        next(error);
    }
}
exports.registration = registration;

const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserService.find();
        res.send(users);
    } catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;

const getUserDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UserService.get(id);
        if (!user) throw new Error("User details not found");
        res.send(user);
    } catch (error) {
        next(error);
    }
};
exports.getUserDetails = getUserDetails;

const uploadImage = async (req, res, next) => {
    try {
        res.send({
            file: req.file,
            message: "Image uploaded successfully."
        });
    } catch (error) {
        next(error);
    }
};
exports.uploadImage = uploadImage;



const uploadMultiple = async (req, res, next) => {
    try {
        const uploadedFiles = {};
        const presignedUrls = {};

        // req.files: { fieldname1: [fileObj, ...], fieldname2: [fileObj, ...], ... }
        for (const field in req.files) {
            uploadedFiles[field] = req.files[field].map(file => file.key);

            // Generate pre-signed URLs for each file in this field
            presignedUrls[field] = await Promise.all(
                req.files[field].map(file => getPresignedUrl(file.key))
            );
        }

        res.json({
            message: "Files uploaded successfully.",
            files: uploadedFiles,      // S3 keys
            urls: presignedUrls        // Pre-signed URLs
        });
    } catch (error) {
        next(error);
    }
};
exports.uploadMultiple = uploadMultiple;