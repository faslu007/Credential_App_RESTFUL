const express = require ('express');
const path = require('path')
const router = express.Router();

const {registerSuperAdmin, loginUser, getMyInfo, getAllUsers, 
       registerUser, verifyOTP, resetPassword, updateUser} = require('../controller/userController') 

const {protect} = require('../middleware/authMiddleware')

const multer  = require('multer');
const { route } = require('./accountsRoutes');
const upload = multer()

//API: /api/users
router.post('/', upload.none(), registerSuperAdmin);
router.post('/verifyOPT', upload.none(), verifyOTP),
router.post('/registerUser', upload.none(), protect, registerUser);
router.post('/login', upload.none(), loginUser);
router.get('/getMyInfo', protect, getMyInfo);
router.get('/getAllUsers', protect, getAllUsers);
router.post('/resetpassword', upload.none(), resetPassword);
router.patch('/updateUser/:id', upload.none(), protect, updateUser)

module.exports = router;
