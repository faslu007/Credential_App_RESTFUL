const asyncHandler = require('express-async-handler');
const Account = require('../models/accountsModel');
const User = require('../models/userModel');
const Provider = require('../models/providerModel');
const path = require("path");




// @GET all Accounts
// @Route Get api/accounts
// @access private - Admin Only - Accounts Management
const getAccounts = asyncHandler( async (req, res) => {
    console.log('it comes here  ')
        if(req.user.role !== 'Admin') {
            res.status(401)
            throw new Error('User does not have privilege to access all accounts')
        }
        try {
            const accounts = await Account.find()
                .populate('assignedUsers', 'firstName lastName')
                .populate('providers', 'providerName');
            res.status(200).json(accounts);
        } catch (error) {
            console.log(error)
            res.status(404)
            throw new Error('Error retrieving all accounts')
        }
});

// @Create an Account
// @Route Post   api/accounts
// @access private - Admin Only - Accounts Management
const createAccount = asyncHandler(async (req, res) => {
    console.log(req.body)
        if(req.user.role != 'Admin'){
            res.status(400)
            throw new Error('User does not have privilege to create a new account, please contact you Administrator');
        }
        const {accountName, accountType, assignedUsers, primaryContactName,
                primaryContactPhone } = req.body;
        if(!accountName  || !assignedUsers || !accountType
            || !primaryContactName || !primaryContactPhone) {
            res.status(400) 
            throw new Error ('Please provide all the fields');
        }
        // create account
        try {
            const account  = await Account.create({
                accountName: accountName,
                accountType: accountType,
                assignedUsers: assignedUsers,
                primaryContactName: primaryContactName,
                primaryContactPhone: primaryContactPhone,
            })
            console.log(account)
            res.status(200).json(account);
        } catch (error) {
            // unlike other validation unique property does not come with message parameter.... 
            // ....so manually passing the error message 
            // error.message.includes('duplicate key error collection') ? (function(){throw new Error('Another account already exists with the same name')}()) : null;
            // res.status(401)
            // throw new Error ( error )
            res.status(400)
            if(error.message.includes('duplicate key error collection')) {
                throw new Error ('Another account exisits with the same name');
            } else {
                throw new Error ('Internal server error')
            }

            
        }
});



// @Update an Account
// @Route Put api/accounts/:id
// @access private - Admin Only - Accounts Management
const updateAccount = asyncHandler( async (req, res) => {
        
            if(req.user.role !== 'Admin' ){
                res.status(401)
                throw new Error('User does not have privilege to update accounts')
            }
            
            const {accountName, accountType, primaryContactName,
                primaryContactPhone } = req.body;
            if(!accountName || !accountType || !primaryContactName || !primaryContactPhone) {
                res.status(401)
                throw new Error('please add all fields')
                }
            
            let activeStatus = req.body.activeStatus;
            if(typeof(activeStatus) != Boolean) {
                try {
                    activeStatus = activeStatus.trim();
                    activeStatus == 'true' ? activeStatus = true : null;
                    activeStatus == 'false' ? activeStatus = false : null;
                    typeof(activeStatus) == 'boolean' ? null : (function(){throw "error"}());
                } catch (error) {
                    res.status(401)
                    throw new Error('Invalid input - Please provide either true or false as value')
                }
            }
            try {
                const updatedAccount = await Account.findOneAndUpdate(
                    { '_id': req.params.id },
                    { '$set': { 'accountName': accountName, 'accountType': accountType, 
                                'primaryContactName': primaryContactName, 'primaryContactPhone': primaryContactPhone,
                                'active': activeStatus }},
                                {new: true, upsert: true})
            res.status(200)
            .json(updatedAccount)
        } catch (error) {
            res.status(501)
            throw new Error('Error updating account information to database')
        }
    
});

// @Update Assigned users of the account
// @Route Put api/accounts/updateAssignedUsers/:id
// @Access Private - Admin Only - Accounts Management 
const updateAssignedUser = asyncHandler( async (req, res) => {
        const { assignedUsers } = req.body;
        try {
            const addUsersToAccount = await Account.findOneAndUpdate(
                {_id: req.params.id},
                { assignedUsers: assignedUsers},
                { upsert: true, new: true}
            ).select('assignedUsers').populate('assignedUsers', 'firstName lastName')
        res.status(200)
        .json(addUsersToAccount)
        
        } catch (error) {
                res.status(500 )
                throw new Error('Error updating information to database')
            }
})


//@Add new Provider / healthcareStaff to the existing Account /Group
//@Route POST api/accounts/registerProvider
//@access Private
const createProvider = asyncHandler( async (req, res) => {
    if(req.user.role !== 'Admin') {
        res.status(401)
        throw new Error ('User does not have privilege to create a provider')
    }
    const {providerName, providerNPI} = req.body
    
    if(!providerName || !providerNPI) {
        res.status(400) 
        throw new Error ('please add all fields');
    };
    try { 
        const provider = await Provider.create({
            providerName: providerName,
            providerNPI: providerNPI,
            account: req.params.id,
            accountType: 'Provider'
        });
        // save provider_ID to its Parent Account
        const saveProviderIdToAccount = await Account.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { providers: provider.id } },
            {   new: true, upsert: true, }
        );
        // push all users who are assigned to the Parent account to its child Provider Model
        const pushUsersToProvider = await Provider.findOneAndUpdate(
            { _id: provider._id },
            { 'assignedUsers': saveProviderIdToAccount.assignedUsers },
            { new: true, upsert: true }
        ).populate('account', 'accountName')

        res.status(200).json(pushUsersToProvider);
} catch (error) {
    // unlike other validations 'unique' does not provide user friendly error message.... 
            // ....so manually passing the error message here
            error.message.includes('duplicate key error collection') ? (function(){throw new Error('Another Provider already exists with the same name')}()) : null;
            res.status(401)
            throw new Error ( error )
    }
}); 


// @Update Provider
// @Route Put api/accounts/providerUpdate/:id
// @access private 
const updateProvider = asyncHandler(async (req, res) => {
            if(req.user.role !== 'Admin'){
                res.status(401)
                throw new Error('User does not have privilege to update Provider info')
            }
            const { providerName, providerNPI } = req.body;
            if(!providerName || !providerNPI){
                res.status(400)
                throw new Error('Please provide all the fields')
            }
            let activeStatus = req.body.activeStatus;
            if(typeof(activeStatus) != Boolean) {
                try {
                    activeStatus = activeStatus.trim();
                    activeStatus == 'true' ? activeStatus = true : null;
                    activeStatus == 'false' ? activeStatus = false : null;
                    typeof(activeStatus) == 'boolean' ? null : (function(){throw "error"}());
                } 
                catch (error) {
                    res.status(401)
                    throw new Error('Invalid input - Please provide either true or false as value')
                }
            }
            try {
                const updateProvider = await Provider.findOneAndUpdate(
                    {_id: req.params.id}, 
                    { '$set': { 'providerName': providerName, 'providerNPI': providerNPI, 
                                'active': activeStatus }},
                                {new: true, upsert: true})
                                .select(' providerName providerNPI active')
                    res.status(202).json(updateProvider)  
            } 
            catch (error) {
                res.status(501)
                throw new Error('Error updating account information to database')
            }
})



// @Delete Accounts
// @Route Delete api/accounts/:id
// @access private
// ||||||This module not completed -  On hold till rest of the routes gets complete |||||||
const deleteAccounts = asyncHandler( async (req, res) => {
    const account = await Account.findById(req.params.id);

    if (!account) {
        res.status(400) 
        throw new Error('Account not found') 
    }
    const deleted = await Account.findByIdAndDelete(req.params.id);
    res.status(200).json({message: `account is deleted of id ${req.params.id}`});
});



module.exports = {
    getAccounts,
    createAccount,
    updateAccount,
    updateAssignedUser,
    updateProvider,
    deleteAccounts,
    createProvider
}

