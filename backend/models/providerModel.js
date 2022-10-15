const mongoose = require('mongoose');

// Individual Providers Schema - to add doctors/healthStaff to the accounts
const providerSchema = mongoose.Schema({
    providerName: {
        type: String,
    },
    providerNPI: {
        type: Number,
    },
    account: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
    }],
    assignedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
    }],
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


module.exports = mongoose.model('Provider', providerSchema)