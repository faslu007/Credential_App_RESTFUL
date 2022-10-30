const nodemailer = require("nodemailer");
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const tempUser = require('../models/tempUser');




// async function to send the OTP verification - this is called from the ..controller/userController.js - registerSuperAmdin()
const sendOTP = async (tempUserInfo, res) => {
    try {
        const OTP = Math.floor(Math.random() * 90000) + 10000;
        // stringify the OTP: to hash it takes only string not numbers
        const otpToString = `${OTP}`
        
        // hash the OTP
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otpToString, salt);
        // save hashed OTP to DB
        const saveOTPtoDB = await tempUser.findByIdAndUpdate(tempUserInfo.id, { otp: hashedOTP })
        
        // Email Template
        const options = {
            from: process.env.auth_Email, // sender address
            to: tempUserInfo.email, // list of receivers
            subject: "Credential Pro App - Email Verification", // OTP passed in the below HTML template
            text: 'Credential-App',
            html: `<body style=" text-align: center; align-items: center;"><div style="background-color:#70a8cb; margin: 10px; border-radius: 8px;"><br> <h1 style="color:rgb(229, 238, 239); font-family:'Segoe UI Ligh'; font-size: 40px;">Credential-Pro-App</h1> <p style="margin-bottom: 20px; color:aliceblue; font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size: 20px;">Verify your Email Address to begin working with our app</p> <h5 style="color:rgb(255, 255, 255); font-size: 25px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">Hi ${tempUserInfo.firstName} ${tempUserInfo.lastName} </h5>  <h5 style="color:rgb(255, 255, 255); font-size: 25px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">Your OTP is </h5> <h3 style="color:rgb(19, 133, 220); font-size: 55px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">${OTP}</h3> <p style="margin-bottom: 20px; color:aliceblue; font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size: 20px;">Your OTP will be valid for 15 Mins from now. Thank you for registering with us</p> <br> </div> </body>`
        };
        // Sending email 
        transporter.sendMail(options, function (err, info) {
                if(err){ 
                    res.status(400).json(err)
                }
                res.status(200).json({"firstName": saveOTPtoDB.firstName, "lastName": saveOTPtoDB.lastName, "email": saveOTPtoDB.email, "OTPStatus": info})   
          } )
    } catch (error) {
        res.status(400).json(error)
    }
}




// send tempUser Temporary Password - this is called from the ..controller/userController.js - registertempUsers()
const sendUserTempPassword = async (temporaryUser, generatedTempPass, req, res) => {
    try {
        // Email Template
        const options = {
            from: process.env.auth_Email, // sender address
            to: temporaryUser.email, // list of receivers
            subject: "Credential Pro App - User Account Created", // OTP passed in the below HTML template
            text: 'Credential-App',
            html: `<body style="padding: 10px; text-align: center; align-items: center; background-image: url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'); background-position: center;"> <div style="padding: 10px; backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); background-color: rgba(17, 25, 40, 0.75); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.125); margin: 10px; border-radius: 8px;"> <h1 style="color:rgb(229, 238, 239); font-family:'Segoe UI Ligh'; font-size: 40px;">Credential-Pro-App</h1> <h5 style="color:rgb(255, 255, 255); font-size: 25px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; margin-bottom: -20px;">Hi ${temporaryUser.firstName} </h5> <p style="margin-bottom: 20px; color:aliceblue; font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size: 20px;">An account has been created for you by Account Admin ${req.user.firstName} ${req.user.lastName}, here's the temporary password, please update the password at the earliest.</p> <h5 style="color:rgb(255, 255, 255); font-size: 25px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; margin-top: 30px;">Your temporary password is </h5> <h3 style="color:rgb(19, 133, 220); font-size: 55px; margin-bottom: 5px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; margin-top: -40px;">${generatedTempPass}</h3> <br> </div> </body>`
        };
        // Sending email 
        transporter.sendMail(options, function (err, info) {
                if(err){ 
                    res.status(400).json(err)
                }
                res.status(200).json(temporaryUser)   
             })
    } catch (error) {
        res.status(400).json(error)
    }
}


// email configuration
let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.AUTH_EMAIL, 
      pass: process.env.AUTH_PASS, 
    },
  });


module.exports = {
    sendOTP,
    sendUserTempPassword
}