const mongoose = require('mongoose');
const Provider = require('../models/providerModel');


// The Account schema
const accountSchema = mongoose.Schema({
    
    accountName: {
        type: String, 
        required: true, 
        trim: true,
        max: 20,
        unique: [true, 'Another account already exist with this name']
    },
    accountType: {
        type: String,
        enum : ['Group','Facility'],
        required: [true, 'please add account type Facility / Group']
    },
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
    active: {
        type: Boolean,
        required: false,
        default: true
    }
},
{
    timestamps: true,
    }
);

// mongoose post hook -- update the assignedUsers to its providers whenever assigned user info gets changed
accountSchema.post('findOneAndUpdate', async function (doc, next){
    if(doc.assignedUsers){
        const addAssignedUsersToProvider = await Provider.updateMany(
            { 'account': doc._id }, {'assignedUsers': doc.assignedUsers})
    }
    next()
})

module.exports = mongoose.model('Account', accountSchema)