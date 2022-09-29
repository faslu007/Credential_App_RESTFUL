const mongoose = require('mongoose');


// The Account schema
const accountSchema = mongoose.Schema({
    accountName: {
        type: String,
        required: [true, 'please add account name']
    } ,
    accountType: {
        type: String,
        required: [true, 'please add account type Facility / Group']
    } ,
    providers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
      }],
    assignedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      }],
    inactiveStatus: {
        type: Boolean,
        required: false,
    }
},
{
    timestamps: true,
    }
)

module.exports = mongoose.model('Account', accountSchema)