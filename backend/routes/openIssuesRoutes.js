const express = require ('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')
const {uploadMiddleware, getUploadedFile, uploadProgress_Middleware} = require('../middleware/fileUpload')
const multer  = require('multer')
const upload = multer();

const { createOpenIssues,
        updateOpenIssues } = require('../controller/openIssuesController');


//API -- /api/openIssues
router.post('/:id', protect, upload.none(), createOpenIssues);
router.put('/:id', protect, upload.none(), updateOpenIssues);


module.exports = router;