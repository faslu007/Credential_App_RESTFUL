const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
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
    role: {
        type: String,
        required: [true, 'Please add a userRole'],
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
    
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema) 