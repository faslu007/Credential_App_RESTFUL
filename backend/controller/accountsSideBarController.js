const asyncHandler = require('express-async-handler');
const Account = require('../models/accountsModel');


// @Get all active Accounts list (_id, Name, Type) to display in the Second Sidebar or Accounts Sidebar
// @Route GET   api/accounts/getAccountsListForSideBar
// @Access Private - All Auth Users can access and retrieve allowed accounts
// If Admin - returns all Active accounts 
// If User || ViewOnly - returns all Active accounts that are assigned to them 
const getAccountsListForSideBar = asyncHandler( async (req, res) => {
    if(req.user.role == 'Admin'){
        try {
            const accountsList = await Account.find({active: true})
                .select('accountName providers accountType')
                .populate({ path: 'providers', 
                                    match: {active: true},
                                    select: 'providerName providerNPI accountType'
                                })
            res.status(200).json(accountsList)
            
        } catch (error) {
            res.status(500)
            throw new Error ('An error occurred while retrieving the accounts list')
        }
    }
    if(req.user.role == 'User' || 'ViewOnly'){
        try {
            const accountsList = await Account.find({assignedUsers: req.user.id}, {active: true})
                .select('accountName providers accountType')
                .populate({ path: 'providers', 
                                    match: {active: true},
                                    select: 'providerName providerNPI'
                                })
            res.status(200).json(accountsList)
        } catch (error) {
            
        }
    }
    
});


module.exports = {
    getAccountsListForSideBar
}