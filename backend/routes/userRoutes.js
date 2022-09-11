const express = require ('express');
const router = express.Router();
const {registerSuperAdmin, loginUser, getMe, 
       registerSubUsers, verifyOTP} = require('../controller/userController') 
const {protect} = require('../middleware/authMiddleware')
const multer  = require('multer')
const upload = multer()

//API: /api/users
router.post('/', upload.none(), registerSuperAdmin);
router.post('/verifyOPT', upload.none(), verifyOTP),
router.post('/registerSubUser', protect, registerSubUsers)
router.get('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router;
