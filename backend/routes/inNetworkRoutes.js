const express = require ('express');
const router = express.Router();
const { createInNetwork, updateInNetwork,
        createComment, getCommentsOfInNetwork, getAllInNetworks,  } = require('../controller/inNetwrokController') 
const {protect} = require('../middleware/authMiddleware')

const { uploadMiddleware, 
        getUploadedFile, 
        uploadProgress_Middleware } = require('../middleware/fileUpload')

const multer  = require('multer')
const upload = multer()

//API --- /api/inNetwork/
router.post('/:id', protect, upload.none(), createInNetwork);
router.put('/:id', protect, upload.none(), updateInNetwork)

router.post('/inNetworkNotes/:id', protect, uploadProgress_Middleware, uploadMiddleware, createComment)

router.get('/:id', protect, getAllInNetworks)


router.get('/getInNetworkNotes/:id', protect, getCommentsOfInNetwork)
router.get('/notes/uploads/:id', protect, getUploadedFile) // Note: should be requested with fileID in the params


module.exports = router;