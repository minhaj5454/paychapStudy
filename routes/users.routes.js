const UserController = require('../controller/users.controller');
const upload = require('../middlewares/S3/s3-middleware-multiple')();
const uploadFile = require('../middlewares/S3/s3-middleware')('user');

module.exports = async (app) => {
    app.post('/user', UserController.registration);
    app.get('/user', UserController.getAllUsers);
    app.get('/user/:id', UserController.getUserDetails);
    app.post('/uploadImage', uploadFile.single('user'), UserController.uploadImage);
        app.post('/uploadMultiple', upload.fields([{ name: 'media', maxCount: 3 }, { name: 'barcode', maxCount: 3 }]), UserController.uploadMultiple);
};