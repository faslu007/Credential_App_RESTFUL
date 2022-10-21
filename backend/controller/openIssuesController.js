const asyncHandler = require('express-async-handler');
const Account = require('../models/accountsModel');
const Provider = require('../models/providerModel');
const User = require('../models/userModel');
const openIssue = require('../models/openIssuesModel');


const createOpenIssues = asyncHandler(async (req, res) => {
    const {issueName, status, assignedUsers, trackingID, 
            dueDate } = req.body;
    
    if(!issueName || !status || !assignedUsers || ! trackingID || !dueDate) {
            res.status(400)
            throw new Error('Please provide all the required fields');
    };
    if (req.user.role == 'ViewOnly') {
            res.status(401)
            throw new Error('You do not have permission to create new Insurance/payer')
    };

    let isAccountAssigned;
    if(req.user.role == 'Admin' || 'User') {
        const  account = await Account.findOne({_id: req.params.id}).select('assignedUsers')
        account && account.assignedUsers.includes(req.user.id) ? isAccountAssigned = account : isAccountAssigned = false; 
    };

    let isProviderAssigned;
    if(req.user.role.includes('Admin' || 'User') &&   !isAccountAssigned){
        const  provider = await Provider.findOne({_id: req.params.id}).select('assignedUsers') 
        provider.assignedUsers.includes(req.user.id) ? isProviderAssigned = true : isProviderAssigned = false;
    };
    // Proper error message not going to client - need a little tweak
    isAccountAssigned || isProviderAssigned == true ? null : (function(){throw new Error
        ('You do not have permission to add Insurance to this Account / Provider')}())
    
    if(isAccountAssigned){
        try {
            const issue = await  openIssue.create({
                issueName: issueName,
                status: status,
                users: assignedUsers,
                trackingID: trackingID,
                dueDate: dueDate,
                account: req.params.id,
            });
        
            if(issue) {
                const makeNote = await openIssue.findByIdAndUpdate({id: issue._id},
                    { 
                        $push: {
                            notes: {
                                user : req.user.id,
                                commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                note : `${req.user.firstName} ${req.user.lastName} has created a new ticket / issue ${insurance.issueName}`,
                                
                            }
                        }
                    },
                    {new:true, upsert: true}        
                    ).select('-notes')
                
                res.status(200).json(makeNote)
            }
        } catch (error) {
            res.status(500)
            throw new Error('Error saving the ticket / open issues to the database!')
        }
    };

    if(isProviderAssigned){
        try {
            const issue = await  openIssue.create({
                issueName: issueName,
                status: status,
                users: assignedUsers,
                trackingID: trackingID,
                dueDate: dueDate,
                provider: req.params.id,
            });

            if(issue) {
                const makeNote = await openIssue.findByIdAndUpdate({id: issue._id},
                    { 
                        $push: {
                            notes: {
                                user : req.user.id,
                                commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                note : `${req.user.firstName} ${req.user.lastName} has created a new ticket / issue ${insurance.issueName}`,
                                
                            }
                        }
                    },
                    {new:true, upsert: true}        
                    ).select('-notes')
                
                res.status(200).json(makeNote)
            }
        } catch (error) {
            res.status(500)
            throw new Error('Error saving the ticket / open issues to the database!')
        }
    };
});



module.exports = {
    createOpenIssues
}
