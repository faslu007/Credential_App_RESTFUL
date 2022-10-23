const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer()
const {protect} = require('../middleware/authMiddleware');
const { createPortalLogin } = require('../controller/portalLoginsController');




//API --- /api/portalLogins/
router.post('/:id', upload.none(), protect, createPortalLogin);


module.exports = router
