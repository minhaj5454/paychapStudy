// src/routes/admin.routes.js
const AdminController = require('../controller/admin.controller');
const authenticateJWT = require('../middlewares/auth'); 
const ensureSuperAdmin = require('../middlewares/ensureSuperAdmin');
const uploadFile = require('../middlewares/S3/s3-middleware')('adminprofile');

module.exports = (app) => {
  app.post('/admin', AdminController.createAdmin);
  app.post('/admin/login', AdminController.loginAdmin);
  app.post('/admin/sub-admin', authenticateJWT, AdminController.createSubAdmin);
  app.patch('/admin/sub-admin/:uuid', AdminController.editSubAdmin);
  app.get('/admin/sub-admin/:uuid', AdminController.getSubAdminDetails);
  app.get('/admin/sub-admins', authenticateJWT, AdminController.getAllSubAdmins);
  app.put('/admin/:uuid/privileges', AdminController.updatePrivileges);
  app.patch('/admin/privileges/:uuid/status', AdminController.updatePrivilegeStatus);
  app.patch('/admin/:uuid/status', AdminController.updateAdminStatus);
  app.post('/createSubAdmin', uploadFile.single("adminprofile"), AdminController.createSubAdmin);
  
};
