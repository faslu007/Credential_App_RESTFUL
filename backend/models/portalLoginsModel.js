const mongoose = require('mongoose');



const securityQuestionsSchema = mongoose.Schema({
    securityQuestion: {
        type: String,
        max: 75,
    },
    answer: {
        type: String,
        max: 40
    }
})


const portalLoginsSchema = mongoose.Schema({
    portalName: {
        type: String,
        trim: true,
        max: 30, 
    },
    userName: {
        type: String,

        trim: true,
        max: 20,
    },
    registeredEmail: {
        type: String,
        max: 25
    },
    addedBy: {
        type: String,
        trim: true 
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
    },
    password: {
        type: String,
        max: 50,
        trim: true
    },
    link: {
        type: String,
        max: 100,
        trim: true
    },
    securityQuestions: [securityQuestionsSchema],
},
{
    timestamps: true,
});


module.exports = mongoose.model('PortalLogin', portalLoginsSchema)

