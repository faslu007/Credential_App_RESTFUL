const mongoose = require('mongoose');
const validatorPackage = require('validator');

const userSchema = mongoose.Schema(
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
          required: [true, 'Please add an email address'],
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
        role: {
          type: String,
          enum : ['User','Admin','ViewOnly'],
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
        },
        {
          timestamps: true,
        }
      )

module.exports = mongoose.model('User', userSchema) 