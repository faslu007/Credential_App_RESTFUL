const mongoose = require('mongoose');

// Individual Providers Schema - to add doctors/healthStaff to the accounts
const providerSchema = mongoose.Schema({
    providerName: {
        type: String, 
        required: true, 
        trim: true,
        max: 20,
        unique: [true, 'Another account already exist with this name']
    },
    providerNPI: {
        type: Number,
        required: true,
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
    },
    assignedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
    }],
    accountType: {
        type: String,
        default: 'Provider',
        required: [true, 'please add account type Facility / Group']
    } ,
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
providerSchema.post('save', async function (doc, next) {
    console.log(doc)
    next()
})

module.exports = mongoose.model('Provider', providerSchema)