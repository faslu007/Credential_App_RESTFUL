const nodemailer = require("nodemailer");
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModels');
const userOTP = require('../models/userOTPModel');

let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'credential-app@outlook.com', 
      pass: 'Welcome@123', 
    },
  });


// async function to send the OTP verification
const sendOTP = async (tempUser, res) => {
    try {
    const OTP = Math.floor(Math.random() * 90000) + 10000;
    // stringify the OTP: to hash, it takes only string not numbers
    const stringTO = `${OTP}`
    
    // hash the password
    const stalt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(stringTO, stalt);
    // save hashed OTP to DB
    const savaeOTPtoDB = await userOTP.findByIdAndUpdate(tempUser.id, { otp: hashedOTP })
    
    // Email Template
    const options = {
        from: process.env.auth_Email, // sender address
        to: tempUser.email, // list of receivers
        subject: "Credential Pro App - Email Verification", // Subject line - OTP included in the below HTML
        html: `<body style=" text-align: center; align-items: center;"><div style="background-color:#70a8cb; margin: 10px; border-radius: 8px;"><br> <h1 style="color:rgb(229, 238, 239); font-family:'Segoe UI Ligh'; font-size: 40px;">Credential-Pro-App</h1> <p style="margin-bottom: 20px; color:aliceblue; font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size: 20px;">Verify your Email Address to begin working with our app</p> <h5 style="color:rgb(255, 255, 255); font-size: 25px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">Hi ${tempUser.name} </h5>  <h5 style="color:rgb(255, 255, 255); font-size: 25px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">Your OTP is </h5> <h3 style="color:rgb(19, 133, 220); font-size: 55px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">${OTP}</h3> <p style="margin-bottom: 20px; color:aliceblue; font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size: 20px;">Your OTP will be valid for 15 Mins from now. Thank you for registering with us</p> <br> </div> </body>`
    };
    // Sending email 
    transporter.sendMail(options, function (err, info) {
            if(err){
                res.status(400).json(err)
            }
            res.status(200).json({"name": savaeOTPtoDB.name, "email": savaeOTPtoDB.email, "OTPStatus": info})   
          } )
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = {
    sendOTP
}