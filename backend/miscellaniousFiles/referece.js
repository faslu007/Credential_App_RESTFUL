const createComment = asyncHandler(async (req, res) => {
    const { file } = req;
    console.log(file.originalname);
    const { id } = file;
    if(!req.body.notes) {  // form validation
        res.status(400) 
        throw new Error ('please add comments');
    } 
    // add comment to in-network notes schema
    try {
        const notes  = await InNetwork.findByIdAndUpdate({_id: req.params.id },
            { 
                $push: {
                    notes: {
                        user : req.user.id,
                        commenterName: req.user.name,
                        note : req.body.notes,
                        fileID: id,
                        fileName: file.originalname
                    }
                }
            },
            { upsert: true } 
            )
        // Send added comment back to User
        const returnComment = await InNetwork.findById(notes.id).select('notes')
        const lastComment = returnComment.notes.slice(-1)
        res.status(200).json(lastComment);
    } catch (error) {
            res.status(401).json(error);
        }
});


// const express = require('express');
// const dotenv = require('dotenv').config();
// const port = process.env.PORT || 5000;
// const {errorHandler} = require('./middleware/errorMiddleware')
// const colors = require('colors');
// const connectDB = require('./config/db');
// const multer = require("multer");
// // const upload = multer();
// const bodyParser = require('body-parser');
// const app = express();
// const mongoose = require('mongoose')

// const path = require("path");
// const crypto = require("crypto");
// const {GridFsStorage} = require('multer-gridfs-storage');
// const url = process.env.MONGO_URI;



// connectDB();

// // for parsing application/json
// app.use(bodyParser.json());

// app.use(express.json());
// // for parsing application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true })); 

// // for parsing multipart/form-data
// // app.use(upload.array()); 
// app.use(express.static('public'));




// // Connection for Grid-FS
// const conn = mongoose.createConnection(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });

// // init gfs
// let gfs;
// conn.once("open", () => {
//     console.log('Grid-FS DB Connected')
//   // init stream
//   gfs = new mongoose.mongo.GridFSBucket(conn.db, {
//     bucketName: "fileUploadsCredApp"
//   });
// });



// // Storage
// const storage = new GridFsStorage({
//     url: url,
//     options: { useUnifiedTopology: true },
//     file: (req, file) => {
//     //   console.log(parseInt(req.headers["content-length"]));
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           const ids = buf.toString("hex");
//           const fileInfo = {
//             filename: file.originalname,
//             bucketName: "fileUploadsCredApp",
//             metadata: {
//               uploader: req.body.Username,
//               fileIds: ids,
//             },
//           };
//           tempDocumentDetails = fileInfo;
//           console.log(fileInfo)
//           resolve(fileInfo);
//         });
//       }
//       ); 
//     }
//   });
  

//   const store = multer({
//     storage,
//   // limit the size to 20mb for any files coming in
//   limits: { fileSize: 20000000 },
//   // filer out invalid filetypes
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
//   });

//   function checkFileType(file, cb) {
//     // define a regex that includes the file types we accept
//     const filetypes = /jpeg|jpg|png|pdf|gif/;
//     //check the file extention
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     // more importantly, check the mimetype
//     const mimetype = filetypes.test(file.mimetype);
//     // if both are good then continue
//     if (mimetype && extname) return cb(null, true);
//     // otherwise, return error message
//     cb('filetype');
//   }

//   const uploadMiddleware = (req, res, next) => {
//     const upload = store.single('file');
//     upload(req, res, function (err) {
//       if (err instanceof multer.MulterError) {
//         return res.status(400).send('File too large');
//       } else if (err) {
//         // check if our filetype error occurred
//         if (err === 'filetype') return res.status(400).send('Image files only');
//         // An unknown error occurred when uploading.
//         return res.sendStatus(500);
//       }
//       // all good, proceed
//       next();
//     });
//   };
  


//  // this route will be accessed by any img tags on the front end which have
// // src tags like
// // <img src="/api/image/123456789" alt="example"/>
// // <img src={`/api/image/${user.profilePic}`} alt="example"/>
// app.get('/uploads/:id', ({ params: { id } }, res) => {
//     // if no id return error
//     if (!id || id === 'undefined') return res.status(400).send('no image id');
//     // if there is an id string, cast it to mongoose's objectId type
//     const _id = new mongoose.Types.ObjectId(id);
//     // search for the image by id
//     gfs.find({ _id }).toArray((err, files) => {
//       if (!files || files.length === 0)
//         return res.status(400).send('no files exist');
//       // if a file exists, send the data
//       gfs.openDownloadStream(_id).pipe(res);
//     });
//   });


  


// // all routes
// app.use('/api/accounts', require('./routes/accountsRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/inNetwork', require('./routes/inNetworkRoutes'));

// app.use(errorHandler);


// app.listen(port, ()=> console.log(`Server started on ${port}`));




const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModels');
const userOTP = require('../models/userOTPModel');
const nodemailer = require("nodemailer");


// Email Provider - to Send OTP
let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'credential-app@outlook.com', // generated ethereal user
      pass: 'Welcome@123', // generated ethereal password
    },
  });

 
   const options = {
     from: process.env.auth_Email, // sender address
     to: "fasluk007@gmail.com", // list of receivers
     subject: "Credential Pro App - Email Verification", // Subject line
     text: "Hello world?", // plain text body
     html: `<body style=" text-align: center; align-items: center;"><div style="background-color:#70a8cb; margin: 10px; border-radius: 15px;"><br> <h1 style="color:rgb(229, 238, 239); font-family:'Segoe UI Ligh'; font-size: 40px;">Credential-Pro-App</h1> <p style="margin-bottom: 20px; color:aliceblue; font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size: 20px;">Verify your Email Address to begin working with our app</p> <h5 style="color:rgb(255, 255, 255); font-size: 25px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">Your OTP is </h5> <h3 style="color:rgb(19, 133, 220); font-size: 55px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">${generateOTP}</h3> <p style="margin-bottom: 20px; color:aliceblue; font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size: 20px;">Thank you for registering with us</p> <br> </div> </body>`
 };
 
   transporter.sendMail(options, function (err, info) {
     if(err){
         console.log(err)
     }
     console.log(info.response)
   } )





// @Register User
// @Route POST api/users/
// @access Public
const registerSuperAdmin = asyncHandler( async (req, res) =>{
    const {name, email, password} = req.body
    // form validation
    if (!name || !email || !password){
        res.status(400)
        throw new Error('Please add all feilds')
    }

    // if user exists in db
    const userExists = await User.findOne({email});
    if (userExists) {
        res.status(400)
        throw new Error('User already exists');
    }

    // hash the password
    const stalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, stalt);

    //create user
    const user = await User.create({
        name,
        email,
        role: 'SuperAdmin',
        password: hashedPassword
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})


// @Login Usres
// @Route POST api/users/login
// @access Public
const loginUser = asyncHandler( async (req, res) =>{
    const {email, password} = req.body
    // check user email and get the user data
    const user = await User.findOne({email});

    // check the password
    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// @Get Users Data
// @Route Get api/users/me
// @access Private
const getMe = asyncHandler( async (req, res) =>{
    const {_id, name, email, role, account, subUsers } = await User.findById(req.user.id).populate('account', { _id: 1, name: 1, type: 1, providers: 1, }).populate('subUsers', {_id: 1, name: 1});

    res.status(200).json({
        id: _id,
        name,
        email,
        role,
        account,
        subUsers   
    })
});

// @POST subUsers - under SuperAdmin
// @Route POST api/users/registerSubUser
// @access Private
const registerSubUsers = asyncHandler (async (req, res) => {
    // validate the request User === SuperAdmin
    if (!req.user.role === 'SuperAdmin'){
        res.status(400)
        throw new Error ('Requested User does not have privilages to create subUsers')
    }

    const {name, email, password} = req.body
    // form validation
    if(!name || !email || !password ) {
        res.status(400)
        throw new Error ('Please add all feilds')
    }

    // if user already exists in the db
    const userExists = await User.findOne({email});
    if (userExists) {
        res.status(400)
        throw new Error('User already exists');
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt) 

     // create new subUser
     const user = await User.create({
        name,
        email,
        role: 'Admin',
        password: hashedPassword
    });

    if (user) {
         // save subUsers Info to the superAdmin DB
        const saveUserToSuperAdmin = await User.findOneAndUpdate(
            { _id: req.user.id },
            { $push: { subUsers: user.id } },
            { upsert: true }
        );
        
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email
        })
    }
})

// generate JWT Token
const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '5d',
    })
}

module.exports = {
    registerSuperAdmin,
    loginUser,
    getMe,
    registerSubUsers
}