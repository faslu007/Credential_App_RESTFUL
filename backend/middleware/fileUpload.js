const multer = require("multer");
const dotenv = require('dotenv').config();
const mongoose = require('mongoose')
const path = require("path");
const crypto = require("crypto");
const {GridFsStorage} = require('multer-gridfs-storage');
const router = require('express').Router();
const url = process.env.MONGO_URI;

// Connection for Grid-FS
  const conn = mongoose.createConnection(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

// init gfs
    let gfs;
    conn.once("open", () => {
      process.env.NODE_ENV ==  'development' ? console.log('Grid-FS DB Connected') : null;
      // init stream
      gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "fileUploadsCredApp"
      });
    });

// GridFS - Storage
  const storage = new GridFsStorage({
      url: url,
      options: { useUnifiedTopology: true },
      file: (req, file) => {
      //   console.log(parseInt(req.headers["content-length"]));
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const ids = buf.toString("hex");
            const fileInfo = {
              filename: file.originalname,
              bucketName: "fileUploadsCredApp",
              metadata: {
                uploader: req.user.name,
                fileIds: ids,
              },
            };
            tempDocumentDetails = fileInfo;
            resolve(fileInfo);
          });
        }
        ); 
      }
    });
  
  // multer libarary to deal with parsing the files
    const store = multer({
      storage,
    // limit the size to 20mb for any files coming in
      limits: { fileSize: 20000000 },
    // filer out invalid filetypes
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
    });

    function checkFileType(file, cb) {
        // define a regex that includes the file types we accept
          const filetypes = /jpeg|jpg|png|pdf|gif/;
          //check the file extention
          const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
          // more importantly, check the mimetype
          const mimetype = filetypes.test(file.mimetype);
          // if both are good then continue
          if (mimetype && extname) return cb(null, true);
        // otherwise, return error message
        cb('filetype');
    }

  // Middlware to call file upload feature from the routes file
  const uploadMiddleware = (req, res, next) => {
    const upload = store.single('file');
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({'message': 'File too large', 'userNotes': req.body.notes});
      } else if (err) {
        // check if our filetype error occurred
        if (err === 'filetype') return res.status(400).json({'message': 'File type not supported: please upload jpeg | png | pdf | tiff', 'userNotes': req.body.notes});
        // An unknown error occurred when uploading.
        return res.sendStatus(500);
      }
      // all good, proceed
      next();
    });
  };

  

// middleware to send files back to the Users
const getUploadedFile = async ({ params: { id } }, res) => {
      // if no id return error
    if (!id || id === 'undefined') return res.status(400).send('no file id');
    // if there is an id string, cast it to mongoose's objectId type
    const _id = new mongoose.Types.ObjectId(id);
     // search for the image by id
    gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0)
      return res.status(400).send('no files exist');
    // if a file exists, send the data
    gfs.openDownloadStream(_id).pipe(res);
  });
}

// fileUpload progress tracking to send to client in the future using Socket.io
function progress_middleware(req, res, next){
  let progress = 0;
  const file_size = req.headers["content-length"];
  
  // set event listener
  req.on("data", (chunk) => {
      progress += chunk.length;
      const percentage = (progress / file_size) * 100;
      // other code ...
  
  });

  // invoke next middleware
  next();
}



  module.exports = {
    uploadMiddleware,
    getUploadedFile,
    progress_middleware
  }