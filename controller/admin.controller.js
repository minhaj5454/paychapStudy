// src/controllers/admin.controller.js
const AdminService = require('../service/admin/adminService');
const { decryptionFunction, encryptionFunction } = require('../utils/encryptDecrypt');
const bcrypt = require("bcryptjs")
const { sendSuccess, sendError } = require('../utils/responseWrapper');

const createAdmin = async (req, res, next) => {
  try {
    const admin = await AdminService.createAdmin(req.body);
    res.status(201).json(admin);
  } catch (error) {
    next(error);
  }
};
 
const loginAdmin = async (req, res, next) => {
  try {
    const admin = await AdminService.loginAdmin(req.body);
    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

// const createSubAdmin = async (req, res, next) => {
//   try {
//     const subAdmin = await AdminService.createSubAdmin(req.body);
//     res.status(201).json(subAdmin);
//   } catch (error) {
//     next(error);
//   }
// };

const editSubAdmin = async (req, res, next) => {
  try {
    const subAdmin = await AdminService.editSubAdmin(req.params.uuid, req.body);
    res.status(200).json(subAdmin);
  } catch (error) {
    if (error.message === 'SubAdmin not found') {
      res.status(404).json({ error: 'SubAdmin not found' });
    } else {
      next(error);
    }
  }
}; 

const getSubAdminDetails = async (req, res, next) => {
  try {
    const subAdmin = await AdminService.getSubAdminDetails(req.params.uuid);
    res.status(200).json(subAdmin);
  } catch (error) {
    next(error);
  }
};

const getAllSubAdmins = async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const result = await AdminService.getAllSubAdmins(search, parseInt(page), parseInt(limit));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updatePrivileges = async (req, res, next) => {
  try {
    const updatedAdmin = await AdminService.updatePrivileges(req.params.uuid, req.body.privileges);
    res.status(200).json(updatedAdmin);
  } catch (error) {
    if (error.message === 'Admin not found') {
      res.status(404).json({ error: 'Admin not found' });
    } else {
      next(error);
    }
  }
};

const updatePrivilegeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { uuid } = req.params;
    const updatedPrivilege = await AdminService.updatePrivilegeStatus(uuid, status);
    res.status(200).json(updatedPrivilege);
  } catch (error) {
    if (error.message === 'Privilege not found') {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const updateAdminStatus = async (req, res) => {
  const { uuid } = req.params;
  const { status } = req.body;

  try {
    const updatedAdmin = await AdminService.updateAdminStatus(uuid, status);
    res.json(updatedAdmin);
  } catch (err) {
    if (err.message === 'Status must be a boolean') {
      res.status(400).json({ error: err.message });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

  
const createSubAdmin = async(req,res) => {
    try {
        const {data} = req.body;
        const decryption = decryptionFunction(data)

        if(!decryption.username || !decryption.email || !decryption.password || !decryption.confirmPassword){
            return sendError(res, req.t("content_not_empty"))
        }
        const email = decryption.email;
        const findExist = await AdminService.findByAny({email})
        if(findExist){
            return sendError(res, req.t("user_already_exists"))
        }

        if(decryption.password !== decryption.confirmPassword ) {
        return sendError(res, req.t("confirm_password_not_match"))
    }

        const hashPassword = await bcrypt.hash(decryption.password, 10)
       if(!hashPassword){
            return sendError(res, req.t("try_again"))
        }
 
        const adminData = {
      //uuid: prisma.uuid(),
      username: decryption.username,
      email: decryption.email,
      password: hashPassword,
      profileKey : req.file.key

    }
        const adminCreated = await AdminService.createAdmin(adminData)

        if(!adminCreated){
            return sendError(res, req.t("failed_to_create_admin"))
        }

        const encryption = encryptionFunction(adminCreated)

        return sendSuccess(res, 201, req.t("admin_created_successfully"), encryption)

    } catch (error) {
        console.log("error is in create subAdmin : ", error)
        sendError(res,req.t("something_went_wrong"))
    }
}

module.exports = {
  createAdmin,
  loginAdmin,
  createSubAdmin,
  editSubAdmin,
  getSubAdminDetails,
  getAllSubAdmins,
  updatePrivileges,
  updatePrivilegeStatus,
  updateAdminStatus
};
