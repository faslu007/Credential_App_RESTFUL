const asyncHandler = require('express-async-handler');
const Account = require('../models/accountsModel');
const User = require('../models/userModel');
const Provider = require('../models/providerModel');
const path = require("path");
const { error } = require('console');



// @GET Accounts
// @Route Get api/accounts
// @access private - Admin Only - Accounts Management
const getAccounts = asyncHandler( async (req, res) => {
    console.log(req.user)
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
        res.status(404)
        throw new Error('Error retrieving all accounts')
    }
});

// @Create Account
// @Route Post   api/accounts
// @access private
const createAccount = asyncHandler(async (req, res) => {
        if(req.user.role != 'Admin'){
            res.status(400)
            throw new Error('User does not have priviliage to create a new account, please contact you Administrator');
        }
        const {accountName, accountType, assignedUsers, primaryContactName,
                primaryContactPhone} = req.body;
        if(!accountName || !accountType || !assignedUsers 
            || !primaryContactName || !primaryContactPhone) {
            res.status(400) 
            throw new Error ('Please provide all the fields');
        }
        // create account
        const account  = await Account.create({
            accountName: accountName,
            accountType: accountType,
            assignedUsers: assignedUsers,
            primaryContactName: primaryContactName,
            primaryContactPhone: primaryContactPhone,
        })
        
        res.status(200).json(account);
});


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
            account: req.params.id
        });
        // save provider_ID to its Parent Account
        const saveProviderIdToAccount = await Account.updateOne(
            { _id: req.params.id },
            { $push: { providers: provider.id } },
            { upsert: true }
        );
        // Pushing the users who has access to the Parent Account to the created account
        const getUsers = await Account.find({_id: req.params.id}).select('assignedUsers');
        let usersToPush = getUsers[0].assignedUsers;  // getUsers is an array of objects so index 0 has the users_id object, 
        
        const pushUsersToProvider = await Provider.updateOne(
            { _id: provider._id },
            {
              $push: {
                assignedUsers: {
                   $each: usersToPush,
                   $sort: { score: -1 },
                   $slice: 3
                }
              }
            },
            { upsert: true }
         )
        res.status(200).json(provider);
    } catch (error) {
        throw new Error(error)
    }
}) 



// @Update Accounts
// @Route Put api/accounts/:id
// @access private
const updateAccounts = asyncHandler( async (req, res) => {
    if(req.user.role !== 'Admin' ){
        res.status(401)
        throw new Error('User does not have privilege to update accounts')
    }
    try {
        const updatedAccount1 = await Account.findOneAndUpdate(
            { '_id': req.params.id },
            { '$set': { 'accountName': req.body.accountName}},
                        {new: true})

        // const updatedAccount = await Account.findOneAndUpdate(
        //     { '_id': req.params.id },
        //     {
        //         accountName: req.body.accountName
        //     },
        //     {
        //       new: true,
        //     }
        // )
        res.status(200).json(updatedAccount1)

    } catch (error) {
        res.sendStatus(401).json(error)
    }
    // const account = await Account.findById(req.params.id);
    // if (!account) {
    //     res.status(400) 
    //     throw new Error('Account not found') 
    // }


    // const user = await User.findById(req.user.id)

    // //check user
    // if(!user) {
    //     res.status(401)
    //     throw new Error ('User not found');
    // }

    // // Makesure logged in user has priviliages
    // if(account.user.toString() !== user.id) {
    //     res.status(401) 
    //     throw new Error ('User not autherized')
    // }

    // const updatedAccount = await Account.findByIdAndUpdate(req.params.id, req.body, {
    //     new: true,
    // } )
});



// @Update Provider
// @Route Put api/accounts/providerUpdate
// @access private 


// @Delete Accounts
// @Route Delete api/accounts/:id
// @access private
// ||||||This module not completed|||||||
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
    updateAccounts,
    deleteAccounts,
    createProvider 
}