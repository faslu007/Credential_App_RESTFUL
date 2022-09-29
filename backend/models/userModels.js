const mongoose = require('mongoose');
const validatorPackage = require('validator');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      max: 64,
      required: [true, 'Please add a name'],
    },
    lastName: {
      type: String,
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
      enum : ['user','admin','superAdmin','viewOnly'],
      required: [true, 'Please provide appropriate User Role'],
      default: 'user'
    },
    organization: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      max: 10,
  },
    team: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      max: 10,
},
  designation: {
    type: String,
    trim: true,
    max: 10,
},
  account: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
        }],
  subUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      }],
    superAdmins: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      }], 
     },
    {
      timestamps: true,
    }
  )

module.exports = mongoose.model('User', userSchema) 