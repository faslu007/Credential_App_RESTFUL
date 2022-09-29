const mongoose = require('mongoose');
const validatorPackage = require('validator');

// saves the temporary user data to verify the OTP, if OTP is not verified withing 15mins the data automatically deletes
const tempUserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      max: 64,
      required: [true, 'Please add a name'],
      set: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },},
    lastName: {
      type: String,
      trim: true,
      max: 64,
      set: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      validate: {
        validator: validatorPackage.isEmail,
        message: 'Please provide a valid email',
      }},
      // this regex works for the formats (123) 456-7890 or 123-456-7890
    phone: {
        type: String,
        match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
      },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        },
    userRole: {
        type: String,
        enum : ['User','Admin','SuperAdmin','ViewOnly'],
        required: [true, 'Please provide appropriate User Role'],
        },
    organization: {
        type: String,
        trim: true,
        max: 10,
      },
    team: {
        type: String,
        trim: true,
        max: 10},
    designation: {
          type: String,
          trim: true,
          max: 10,
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

module.exports = mongoose.model('tempUser', tempUserSchema) 