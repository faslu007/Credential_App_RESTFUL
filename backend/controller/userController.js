const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Account = require('../models/accountsModel');
const tempUser = require('../models/tempUser');
const {sendOTP, sendUserTempPassword} = require('../middleware/otpMiddleware'); 


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
    checkStrongPassword(req.body.password) == true ? null : res.status(400).json("Please provide a strong password");
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
        role: 'Admin',
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
        role: 'Admin',
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
            userName: `${user.firstName} ${user.lastName}`,
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
        if(req.user.role == 'Admin'){
            const {_id, firstName, lastName, email, phone, role, 
                organization, team, designation} = await User.findById(req.user.id)
                
            const allAccounts = await Account.find({active: true})
                    .select('accountName accountType providers')
                    .populate({ path: 'providers', 
                                match: {active: true},
                                select: 'providerName providerNPI'
                            })
            const allUsers = await User.find()
                    .select('firstName lastName')
            res.status(200).json({
                id: _id,
                firstName, lastName, email, phone, role, organization, team, 
                designation, allUsers, allAccounts
            })
        } else {
            const {_id, firstName, lastName, email, phone, role, 
                organization, team, designation} = await User.findById(req.user.id)
                
            const allAccounts = await Account.find({assignedUsers: req.user.id, active: true})
                    .select('accountName accountType providers assignedUsers')
                    .populate({ path: 'providers', 
                                match: {active: true},
                                select: 'providerName providerNPI'
                            })
                    .populate({ path: 'assignedUsers', 
                                select: 'firstName lastName'
                            })
            res.status(200).json({
            id: _id,
            firstName, lastName, email, phone, role, organization, 
            team, designation, allAccounts 
        })
        }
    } catch (error) {
        res.status(400)
        throw new Error('Error retrieving user info')
    }
    
});



// @POST register new users by the Admin
// @Route POST api/users/registerUser
// @access Private -Admin only
const registerUser = asyncHandler (async (req, res) => {
    console.log(req.user)
    if (req.user.role !== 'Admin'){
        res.status(400)
        throw new Error ('You do not have privilege to create subUsers')
    }
    const {firstName, lastName, email, role, 
        organization, team, phone, designation} = req.body

        // form validation
    if (!firstName || !lastName || !phone || !organization
            || !email || !team || !designation){
        res.status(400)
        throw new Error('Please add all fields')
        } 

    // if user already exists in the db
    const userExists = await User.findOne({email});
    if (userExists) {
        res.status(400)
        throw new Error('User already exists');
    }
    
    // generate tempPassword
    const generatedTempPass = generatePassword();
    // hash the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedTempPass, salt);

     // create tempUser
    const temporaryUser = await tempUser.create({
        firstName, lastName, email, role, organization, team, phone, designation, password: hashedPassword,
    });
    // further execution passes to the below function in the email middleware
    if (temporaryUser) {
        sendUserTempPassword(temporaryUser, generatedTempPass, req, res)
    }
});


// @GET get all users
// @Route api/users/getallUsers
// @access Private - Admin only
const getAllUsers = asyncHandler(async (req, res) => {
    if(req.user.role != 'Admin') {
        res.status(401)
        throw new Error('User does not have privilege to access all users info')
    }
    try {
        const allUsers = await User.find()
        .select('-password')

        res.status(200).json(allUsers)
    } catch (error) {
        res.status(502)
        throw new Error(error)
    }
})

// @PATCH Update User info
// @Route PATCH  api/users/updateUser
// @access Private - Admin only
const updateUser = asyncHandler (async(req, res) => {
        if(req.user.role != 'Admin') {
            res.status(401)
            throw new Error('Does not have privilege to update user info')
        }
        const {firstName, lastName, email, role, phone,
                organization, team, designation} = req.body
        if(!firstName || !lastName || !email || !role || !team 
            || !phone || !designation || !organization){
            res.status(400)
            throw new Error('Please add all fields')
        }
        try {
            const updatedUser = await User.findOneAndUpdate(
                { '_id': req.params.id },
                { '$set': { 'firstName': firstName, 'lastName': lastName, 
                            'email': email, 'role': role, 'phone': phone,
                            'organization': organization, 'team': team, 'designation':designation}},
                            {new: true}).select('-password')
            if(updatedUser){
                res.status(202).json(updatedUser)
            }
        } catch (error) {
            res.status(500)
            throw new Error('Could not update the info - server error')
        }
})


// @ChangePassword
// @Route POST api/users/resetpassword
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
        const {email, currentPassword, newPassword} = req.body;
            if(!email || !currentPassword || !newPassword){
                res.status(400)
                throw new Error ('Please provide email and password')
            }
            if(checkStrongPassword(newPassword) == false || newPassword == currentPassword){
                res.status(400)
                throw new Error('message: Password is weak or current password is same as new password')
            }
        
        const foundUser = await tempUser.findOne({email})
        
        if(foundUser && (await bcrypt.compare(currentPassword, foundUser.password))) {
            // hash the newPassword to save to DB
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
                // move User from tempUser db to User db
                try {
                    const user = await User.create({
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        email: foundUser.email,
                        phone: foundUser.phone,
                        role: foundUser.role,
                        password: hashedPassword,
                        organization: foundUser.organization,
                        team: foundUser.team,
                        designation: foundUser.designation,
                    })
                    if(user){
                        // delete userInfo from temporary collection
                        const deleteTempUser = await tempUser.findOneAndDelete({email});
                            }
                    res.status(200).json({
                        _id:        user.id,
                        firstName:  user.firstName,
                        lastName:   user.lastName,
                        email:      user.email,
                        token: generateToken(user._id)
                        })
                } catch (error) {
                    res.status(501)
                    throw new Error ('Error in activating user account, please contact admin')
                }   
    } else {
            res.status(401)
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
    registerUser,
    verifyOTP,
    resetPassword,
    updateUser,
    getAllUsers
}
