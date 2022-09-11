const express = require('express');
const router = express.Router();
const {getAccounts, createAccounts, updateAccounts, deleteAccounts, registerProvider } = require('../controller/accountsController');
const {protect} = require('../middleware/authMiddleware');
const multer  = require('multer')
const upload = multer()

//API --- /api/accounts/
router.get('/', protect, getAccounts);
router.post('/', upload.none(), protect, createAccounts);
router.put('/:id', protect, updateAccounts);
router.delete('/:id', protect, deleteAccounts);
router.post('/providers', upload.none(), protect, registerProvider)


module.exports = router