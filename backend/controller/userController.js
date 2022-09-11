const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModels');
const userOTP = require('../models/userOTPModel');
const {sendOTP} = require('../middleware/emailMiddleware') 




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

    //create tempUser
    const tempUser = await userOTP.create({
        name,
        email,
        password: hashedPassword
    })

    if(tempUser) {
        // calling sendOTP function to send OTP - located: ..middleware/emailMiddleware.js
        sendOTP(tempUser, res)
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})


const verifyOTP = asyncHandler ( async (req, res) =>{
    const {name, email, otp} = req.body;
    // form validation
    if (!name || !email || !otp){
        res.status(400)
        throw new Error('Name, Email or OTP Missing')
    }
    const tempUser = await userOTP.findOne({email});

    // verify OTP
    if(tempUser && (await bcrypt.compare(otp, tempUser.otp))) {
        //Save validated user to the permenent User DB
        const user = await User.create({
        name: tempUser.name,
        email: tempUser.email,
        role: 'SuperAdmin',
        password: tempUser.password,
    })
    if(user) {
        
        // const sendConfirmation = await sendConfirmation(user);
        // console.log(sendConfirmation)

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })}   
    } else {
            res.status(400)
            throw new Error('Invalid credentials')
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
        res.status(200).json({
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
    // need to make user role validation withDB - not with the data from frontEnd

    const {name, email, password, role} = req.body
    // form validation
    if(!name || !email || !password || !role) {
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
        role,
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
            email: user.email,
            role: user.role
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
    registerSubUsers,
    verifyOTP
}