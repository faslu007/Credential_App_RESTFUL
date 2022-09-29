const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModels');
const {sendOTP, sendSubUserTempPass} = require('../middleware/emailMiddleware'); 
const tempUser = require('../models/tempUser');




// @Register superAdminAccount
// @Route POST api/users/
// @access Public
const registerSuperAdmin = asyncHandler( async (req, res) =>{
    const {firstName, lastName, email, phone,
         password, organization, team, designation} = req.body
    // form validation
    if (!firstName || !lastName || !phone || !organization
        || !email || !password || !team || !designation){
        res.status(400)
        throw new Error('Please add all fields')
    }
    // password strength validation
    checkStrongPassword(req.body.password) == true ? null : res.status(400).json("message: Password is weak");
    // if user exists in db
    const userExists = await User.findOne({email});
    if (userExists) {
        res.status(400)
        throw new Error('Account already exists');
    }
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create tempUser
    const saveTempUser = await tempUser.create({
        firstName, lastName, email, phone,
        organization, team, designation,
        userRole: 'SuperAdmin',
        password: hashedPassword
    })
    if(saveTempUser) {
        // calling sendOTP function to send OTP - located: ..middleware/emailMiddleware.js
        sendOTP(saveTempUser, res)
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})



// @Register verifyRegistrationOTP
// @Route POST api/users/verifyOTP
// @access Public
const verifyOTP = asyncHandler ( async (req, res) =>{
    const {firstName, lastName, email, otp} = req.body;
    // form validation
    if (!firstName || !lastName || !email || !otp){
        res.status(400)
        throw new Error('Name, Email or OTP Missing')
    }
    const foundUser = await tempUser.findOne({email});
    
    // verify OTP
    if(foundUser && (await bcrypt.compare(otp, foundUser.otp))) {
        //Save validated user to the permanent User DB
        const user = await User.create({
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        phone: foundUser.phone,
        userRole: 'superAdmin',
        password: foundUser.password,
        organization: foundUser.organization,
        team: foundUser.team,
        designation: foundUser.designation,
    })
    if(user) {
        // delete userInfo from temporary db
        const deleteTempUser = await tempUser.findOneAndDelete({email});
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



// @Login User
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
// @Route Get api/users/getMyInfo
// @access Private
const getMyInfo = asyncHandler( async (req, res) =>{
    try {
        const {_id, firstName, lastName, email, phone, userRole, account, subUsers } = await User.findById(req.user.id)
        .populate([ 
            { path: 'account', select: '_id accountName providers accountType', populate: [ { path: 'providers', select: '_id providerName' } ] },
            { path: 'subUsers', select: '_id name' }])
    
        res.status(200).json({
            id: _id,
            firstName, lastName, email, phone, userRole, account, subUsers  
        })
    } catch (error) {
        res.status(400)
        throw new Error('Error retrieving user info')
    }
});



// @POST subUsers - under SuperAdmin
// @Route POST api/users/registerSubUser
// @access Private
const registerSubUsers = asyncHandler (async (req, res) => {
    if (req.user.userRole !== 'superAdmin'){
        res.status(400)
        throw new Error ('You do not have privilege to create subUsers')
    }
    const {firstName, lastName, email, userRole, organization, team, phone, designation} = req.body
    // form validation
    if(!firstName || !lastName || !email || !userRole ||!organization || !team || !phone || !designation) {
        res.status(400)
        throw new Error ('Please add all fields')
    }

    // if user already exists in the db
    const userExists = await User.findOne({email});
    if (userExists) {
        res.status(400)
        throw new Error('User already exists');
    }

    // generate tempPassword
    const generatedPass = generatePassword();
    // hash the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPass, salt);

     // create new subUser
     const subUser = await User.create({
        firstName, lastName, email, userRole, organization, team, phone, designation, password: hashedPassword,
    });

    if (subUser) {
         // save subUsers Info to the superAdmin DB
        const saveSubUserToSuperAdmin = await User.findOneAndUpdate(
            { _id: req.user.id },
            { $push: { subUsers: subUser.id } },
            { upsert: true }
        );     
        sendSubUserTempPass(subUser, generatedPass, req, res)
    }
});




// @Register changePassword
// @Route POST api/users/changePassword
// @access Public
const changePassword = asyncHandler(async (req, res) => {
    const {email, currentPassword, newPassword} = req.body;
    if(!email || !currentPassword || !newPassword){
        res.status(400)
        throw new Error ('Please provide email and password')
    }
    if(checkStrongPassword(newPassword) == false || newPassword == currentPassword){
        res.status(400)
        throw new Error('message: Password is weak or current password is same as new password')
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(currentPassword, user.password))) {
        // hash the newPassword to save to DB
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        // save newPass to DB
        const updatePass = await User.findOneAndUpdate({email}, {password: hashedPassword});
        res.status(200).json({
            _id:        user.id,
            firstName:  user.firstName,
            lastName:   user.lastName,
            email:      user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})




// password validation
function checkStrongPassword(str){
    // password validation criteria = min 7 chars, min 1 symbol, min 1 upperCase, & a num
    let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{7,}$/;
    return re.test(str);
}

// create temp password for subUsers
function generatePassword() {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 
            'abcdefghijklmnopqrstuvwxyz0123456789@#$';
        for (let i = 1; i <= 8; i++) {
        var char = Math.floor(Math.random()
                    * str.length + 1);
        pass += str.charAt(char)
    }
      
    return pass;
}


// generate JWT Token on success login & register with expiry 5 days
const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '5d',
    })
}


module.exports = {
    registerSuperAdmin,
    loginUser,
    getMyInfo,
    registerSubUsers,
    verifyOTP,
    changePassword,
}