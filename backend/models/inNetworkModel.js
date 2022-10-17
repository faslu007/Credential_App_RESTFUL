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
      max: 500,
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









// In-Network schema (to contain all the in-network insurance list of the accounts and add its notes for action taken)
const inNetworkSchema = mongoose.Schema({
          insuranceName: {
              type: String,
              max: [15, 'Exceeds maximum allowed character'],
              required: [true, 'Please add insurance name']
          } ,
          status: {
              type: String,
              required: [true, 'please add account type Facility / Group'],
              enum : ['Pending','Submitted','In-Process', 'Deficiency',
                      'Approved', 'Revalidating', 'Denied', 'Panel-Closed'],
          } ,
          assignedUsers: [{
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
          active: {
              type: Boolean,
              required: false,
              default: true
          },
          description: {
              type: String,
            },
          notes: [notesSchema],
      },
    {
        timestamps: true,
        }
);


module.exports = mongoose.model('InNetwork', inNetworkSchema)
