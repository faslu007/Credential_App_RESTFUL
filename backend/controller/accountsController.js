const asyncHandler = require('express-async-handler');
const Account = require('../models/accountsModel');
const User = require('../models/userModels');
const Provider = require('../models/providerModel');
const path = require("path");
// const multer = require("multer");
// // const upload = multer();
const {GridFsStorage} = require('multer-gridfs-storage');
const { Console } = require('console');
const router = require('express').Router();
const url = process.env.MONGO_URI;


// @GET Accounts
// @Route Get api/accounts
// @access private
const getAccounts = asyncHandler( async (req, res) => {
    const accounts = await Account.find({assignedUsers: req.user.id}).populate('assignedUsers', 'name').populate('providers', 'providerName');

    res.status(200).json(accounts);
});

// @Create Account
// @Route Post   api/accounts
// @access private
const setAccounts = asyncHandler(async (req, res) => {
    if(!req.body.accountName || !req.body.accountType) {
        res.status(400) 
        throw new Error ('please all the fields');
    }
    // validating user Role: Only SuperAdmin has priviage to create a new account
    const user = await User.findById(req.user.id).select('role').select('-id');
    if(user.role != 'SuperAdmin'){
        res.status(400)
        throw new Error('User does not have priviliage to create a new account, please contact you Administrator');
    }
    // create account
    const account  = await Account.create({
        accountName: req.body.accountName,
        accountType: req.body.accountType,
    })
    // creating assignedUsers array containing req.body.assignedUsers(from the form) + req.user.id(requesting User from jwt token) 
    const assignedUsers = [req.user.id]
    let usersArray = req.body.assignedUsers;
    if (usersArray.length >=1) {
        usersArray.forEach(element => {
            assignedUsers.push(element)
        });
    }
 
    //Push assigned users to the account created
    if(assignedUsers.length >= 1){
        for (let i = 0; i < assignedUsers.length; i++) {
            const addUsers = await Account.updateOne(
                { _id: account.id },
                { $push: { assignedUsers: [assignedUsers[i]] } },
                { upsert: true }
            );
        }
    }
   
    // save accountID into all the assignedUsers model
    for (let i = 0; i < assignedUsers.length; i++) {
        const accountToUser = await User.updateOne(
            { _id: assignedUsers[i] },
            { $push: { account: [account.id] } },
            { upsert: true }
        )
    };
    
    // returning the account details back to user
    const updatedAccount = await Account.findById(account.id).select('-providers').select('-createdAt').select('-updatedAt').select('-__v')
    
    res.status(200).json(updatedAccount);
});


// @Update Accounts
// @Route Put api/accounts/:id
// @access private  --- ||||||This module not completed|||||||
const updateAccounts = asyncHandler( async (req, res) => {
    const account = await Account.findById(req.params.id);

    if (!account) {
        res.status(400) 
        throw new Error('Account not found') 
    }

    const user = await User.findById(req.user.id)

    //check user
    if(!user) {
        res.status(401)
        throw new Error ('User not found');
    }

    // Makesure logged in user has priviliages
    if(account.user.toString() !== user.id) {
        res.status(401) 
        throw new Error ('User not autherized')
    }

    const updatedAccount = await Account.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    } )
    res.status(200).json(updatedAccount);
});


// @Delete Accounts
// @Route Delete api/accounts/:id
// @access private
const deleteAccounts = asyncHandler( async (req, res) => {
    const account = await Account.findById(req.params.id);

    if (!account) {
        res.status(400) 
        throw new Error('Account not found') 
    }
    const deleted = await Account.findByIdAndDelete(req.params.id);
    res.status(200).json({message: `account is deleted of id ${req.params.id}`});
});


//@Add new Provider / healthcareStaff to the existing Account /Group
//@Route POST api/accounts/registerProvider
//@access Private
const registerProvider = asyncHandler( async (req, res) => {
    if(!req.body.providerName || !req.body.accountId) {
        res.status(400) 
        throw new Error ('please add all fields');
    };
    try {
        const provider = await Provider.create({
            providerName: req.body.providerName,
            account: req.body.accountId
        });

        // save provider_ID to its Account
        const saveProvidertoAccount = await Account.updateOne(
            { _id: req.body.accountId },
            { $push: { providers: provider.id } },
            { upsert: true }
        );

        // Pushing the users who has access to the main Account to this provider
        const getUsers = await Account.find({_id: req.body.accountId}).select('assignedUsers');

        let userstoPush = getUsers[0].assignedUsers;  // getUsers is an array of objects so index 0 has the users_id object, 
        let j =0;
        while (userstoPush.length >= 1 && j < userstoPush.length) {
            for (let i = 0; i < userstoPush.length; i++) {
                j++
                const pushUserstoProvider = await Provider.updateOne(
                    { _id: provider.id },
                    { $push: { assignedUsers: userstoPush[i] } },
                    { upsert: true }
                );
                
            }
        }
        
        // returning the account details back to user
        const updatedAccount = await Provider.findById(provider.id).select('-account').select('-createdAt').select('-updatedAt').select('-__v')
    
        // const returnProvider = await Provider.find({_id: req.body.accountId}).select('assignedUsers');
        
        res.status(200).json(updatedAccount);
    } catch (error) {
        throw new Error('Error adding provider to Database')
    }
}) 

module.exports = {
    getAccounts,
    setAccounts,
    updateAccounts,
    deleteAccounts,
    registerProvider 
}