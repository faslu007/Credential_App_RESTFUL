const mongoose = require('mongoose')

// saves the temporary user data to verify the OTP, if OTP is not verified withing 15mins the data automatically deletes
const userOTPSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    otp: {
        type: String,
      },
    createdAt: { type: Date, expires: '15m', default: Date.now }
    
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('userOTP', userOTPSchema) 