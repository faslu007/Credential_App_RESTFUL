const express = require('express');
const router = express.Router();
const {getAccounts, createAccount, updateAccounts, deleteAccounts, createProvider } = require('../controller/accountsController');
const {protect} = require('../middleware/authMiddleware');
const multer  = require('multer')
const upload = multer()

//API --- /api/accounts/
router.get('/', protect, getAccounts);

router.post('/', upload.none(), protect, createAccount);
router.post('/createProvider/:id', upload.none(), protect, createProvider)

router.put('/:id', upload.none(), protect, updateAccounts);
router.delete('/:id', protect, deleteAccounts);


module.exports = router