const mongoose = require('mongoose');

// Notes schema - for users to put the notes of each action taken for the insurance application
const notesSchema = mongoose.Schema({
  commenterName: {
    type: String,
    required: true
  },
  user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  note: {
      type: String,
      required: true,
    },
  fileID: {
      type: String,
    },
  fileName: {
      type: String,
    },
},
{
  timestamps: true,
  }
);

// In-Network schema (to contain all the in-network insurance list of the account and add its notes for action taken)
const outOfNetworkSchema = mongoose.Schema({
        insuranceName: {
            type: String,
            required: [true, 'please add insurance name']
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
            ref: 'Account',
          },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Provider',
          }, 
        trackingID: {
            type: String,
          },
        dueDate: {
            type: Date,
          },
        inactive: {
            type: { type: Boolean, default: false },
          },
        comments: {
            type: String,
          },
        notes: [notesSchema],
    },
    {
        timestamps: true,
        }
)

module.exports = mongoose.model('OutOfNetwork', outOfNetworkSchema)
