
// deleted from accounts controller
      // const multer = require("multer");
    // // const upload = multer();
    // const {GridFsStorage} = require('multer-gridfs-storage');
    // const { Console } = require('console');
    // const router = require('express').Router();
    // const url = process.env.MONGO_URI;


const mongoose = require('mongoose');



// The Account schema
const insuranceSchema = mongoose.Schema({
    insuranceName: {
        type: String,
        required: [true, 'please add account name']
    } ,
    status: {
        type: String,
        required: [true, 'please add account type Facility / Group']
    } ,
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      }],
    account: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
      },
    trackingID: {
        type: String,
        required: true,
      },
    dueDate: {
        type: Date,
        required: true,
      },
    inactive: {
        type: { type: Boolean, default: false },
        required: true,
      },
    comments: {
        type: String,
        required: true,
      },
    notes: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Notes',
      },
},
{
    timestamps: true,
    }
)

module.exports = mongoose.model('Insurance', insuranceSchema)








