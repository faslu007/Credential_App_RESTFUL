const mongoose = require('mongoose');
const Provider = require('../models/providerModel');


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
    primaryContactName: {
        type: String
    },
    primaryContactPhone: {
        type: String,
        match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
      },
    inactiveStatus: {
        type: Boolean,
        required: false,
        default: false
    }
},
{
    timestamps: true,
    }
);

// mongoose post hook to update the assignedUsers to its providers ..
// .. so both the collection will have same assignedUsers 
accountSchema.post('findOneAndUpdate', async function (doc, next){
    if(doc.assignedUsers){
        const addAssignedUsersToProvider = await Provider.updateMany({ 'account': doc._id }, {'assignedUsers': doc.assignedUsers})
    }
    next()
})

module.exports = mongoose.model('Account', accountSchema)