const express = require ('express');
const router = express.Router();
const { getAllInNetworks, createInNetwork, 
        createComment, getComments, } = require('../controller/inNetwrokController') 
const {protect} = require('../middleware/authMiddleware')
const {uploadMiddleware, getUploadedFile, progress_middleware} = require('../middleware/fileUpload')
const multer  = require('multer')
const upload = multer()

//API --- /api/inNetwork/
router.post('/', protect, upload.none(), createInNetwork)
router.get('/:id', protect, getAllInNetworks)
router.post('/notes/:id', protect, progress_middleware, uploadMiddleware, createComment)
router.get('/notes/:id', protect, getComments)
router.get('/notes/uploads/:id', protect, getUploadedFile) // Note: should be requested with fileID in the params


module.exports = router;