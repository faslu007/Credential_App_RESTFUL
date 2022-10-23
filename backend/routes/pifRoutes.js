const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer()
const {protect} = require('../middleware/authMiddleware');
const { createPIF } = require('../controller/pifController');



//API --- /api/pif/
router.post('/:id', upload.none(), protect, createPIF);


module.exports = router