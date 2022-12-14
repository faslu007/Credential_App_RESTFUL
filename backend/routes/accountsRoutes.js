const express = require('express');
const router = express.Router();
const {getAccounts, createAccount, updateAccount, 
        deleteAccounts, createProvider, updateAssignedUser, 
        updateProvider } = require('../controller/accountsController');

const { getAccountsListForSideBar } = require('../controller/accountsSideBarController')

const {protect} = require('../middleware/authMiddleware');

const multer  = require('multer')
const upload = multer()

//API --- /api/accounts/
router.get('/', protect, getAccounts);
router.get('/getAccountsListForSideBar', protect, getAccountsListForSideBar);

router.post('/', upload.none(), protect, createAccount);
router.post('/createProvider/:id', upload.none(), protect, createProvider)

router.put('/:id', upload.none(), protect, updateAccount);
router.put('/updateAssignedUsers/:id', upload.none(), protect, updateAssignedUser);
router.put('/providerUpdate/:id', upload.none(), protect, updateProvider)

router.delete('/:id', protect, deleteAccounts);


module.exports = router