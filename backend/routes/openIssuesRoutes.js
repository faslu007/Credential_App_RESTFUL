const express = require ('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')
const { uploadMiddleware, 
        getUploadedFile, 
        uploadProgress_Middleware} = require('../middleware/fileUpload')
const multer  = require('multer')
const upload = multer();
const { createOpenIssues,
        updateOpenIssues,
        createCommentOnIssue,
        getCommentsOfIssues } = require('../controller/openIssuesController');


//API -- /api/openIssues
router.post('/:id', protect, upload.none(), createOpenIssues);
router.put('/:id', protect, upload.none(), updateOpenIssues);
router.get('/getCommentsOfIssues/:id', protect, getCommentsOfIssues);

router.post('/notes/:id', protect, uploadProgress_Middleware, uploadMiddleware, createCommentOnIssue);


module.exports = router;