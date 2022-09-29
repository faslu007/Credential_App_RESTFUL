const express = require ('express');
const router = express.Router();
const {registerSuperAdmin, loginUser, getMyInfo, 
       registerSubUsers, verifyOTP, changePassword} = require('../controller/userController') 
const {protect} = require('../middleware/authMiddleware')
const multer  = require('multer')
const upload = multer()

//API: /api/users
router.post('/', upload.none(), registerSuperAdmin);
router.post('/verifyOPT', upload.none(), verifyOTP),
router.post('/registerSubUser', protect, registerSubUsers);
router.post('/changePassword', changePassword);
router.get('/login', upload.none(), loginUser);
router.get('/getMyInfo', protect, getMyInfo);


module.exports = router;
