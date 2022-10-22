"use strict"
const asyncHandler = require('express-async-handler');
const Account = require('../models/accountsModel');
const Provider = require('../models/providerModel');
const openIssue = require('../models/openIssuesModel');


// @Create Open Issues or Tickets (Ticketing System)
// @Route Post   /api/openIssues/:id (account or provider id to which this will be created)
// @Access Private - Admin && User who are assigned to the account can create a new one...
const createOpenIssues = asyncHandler(async (req, res) => {
    const {issueName, status, assignedUsers, trackingID, 
            dueDate } = req.body;
    
    if(!issueName || !status || !assignedUsers || !trackingID || !dueDate) {
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
        provider && provider.assignedUsers.includes(req.user.id) ? isProviderAssigned = true : isProviderAssigned = false;
    };
    
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
            
        if(issue) { // create a note for the issue /ticket created
            const note  = await openIssue.findByIdAndUpdate({_id: issue.id },
                { 
                    $push: {
                        notes: {
                            user : req.user.id,
                            commenterName: `${req.user.firstName} ${req.user.lastName}`,
                            note : `${req.user.firstName} ${req.user.lastName} created new Insurance ${issue._id}`,
                        }
                    }
                },
                {new:true, upsert: true}
                ).select('-notes')
                res.status(200).json(note)
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
                const note  = await openIssue.findByIdAndUpdate({_id: issue.id },
                    { 
                        $push: {
                            notes: {
                                user : req.user.id,
                                commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                note : `${req.user.firstName} ${req.user.lastName} created new Insurance ${issue._id}`,
                            }
                        }
                    },
                    {new:true, upsert: true}
                    ).select('-notes')
                
                res.status(200).json(note)
            }
        } catch (error) {
            res.status(500)
            throw new Error('Error saving the ticket / open issues to the database!')
        }
    };
});


// @Update Open Issues or Tickets (Ticketing System)
// @Route Put   /api/openIssues/:id (openIssue id)
// @Access Private - Admin && User who are assigned to the account can create a new one...
const updateOpenIssues = asyncHandler(async (req, res) => {
            const {issueName, status, assignedUsers, trackingID, dueDate, active, } = req.body;
            if(!issueName || !status || !assignedUsers ||  !trackingID || !dueDate || !active) {
                res.status(401)
                throw new Error('Please add all the required fields');
            };
            if(req.user.role == 'ViewOnly'){
                res.status(401)
                throw new Error('You do not have access to edit this account, please contact Admin.')
            };
            // get the previous state so if the status changed from the last state then a note can be made
            const previousState = await openIssue.findById({_id: req.params.id})
                                                            .select('status dueDate active account provider')
                                                            .populate({ path: 'account', 
                                                            select: 'assignedUsers'
                                                            })
                                                            .populate({ path: 'provider', 
                                                            select: 'assignedUsers'
                                                            })
            let isAccountAssigned;
            if(previousState.account){
                
                previousState.account.assignedUsers.includes(req.user._id) == true ? isAccountAssigned = true : isAccountAssigned = false;
            }
            
            let isProviderAssigned;
            if(previousState.provider){
                
                previousState.provider.assignedUsers.includes(req.user.id) == true ? isProviderAssigned = true : isProviderAssigned = false
            }
            
            if( !isAccountAssigned && !isProviderAssigned ) {
                res.status(401)
                throw new Error('You do not have access to edit this account')
            };
                        
     try{
            // get the requesting issueDetails
            const updatedIssue = await openIssue.findByIdAndUpdate({_id: req.params.id},
                                                                {issueName: issueName, 
                                                                status: status, 
                                                                users: assignedUsers, 
                                                                trackingID:trackingID, 
                                                                dueDate:dueDate, 
                                                                active: active },
                                                                {new: true})
                                                                .select('-notes');
            //create a note if user changed the status eg: Pending to Submitted
            let issueWithUpdatedNote;
            if(previousState.status != updatedIssue.status) {
                issueWithUpdatedNote = await openIssue.findOneAndUpdate({_id: req.params.id},
                    {
                        $push: {
                            notes: {
                                user: req.user.id,
                                commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                note: `${req.user.firstName} ${req.user.lastName} has changed the status to ${updatedIssue.status} from ${previousState.status}`
                            },
                        }
                    }, {new: true, upsert: true})
            };

            res.status(200).json(updatedIssue)

    } catch (error) {
        res.status(501)
        throw new Error('Error saving update to database')
    }
});


// @Create a Note in Open Issues or Tickets 
// @Route Post  /api/openIssues/createNote/:id (openIssue id)
// @Access Private - Admin && User who are assigned to the account can post a note
const createCommentOnIssue = asyncHandler(async (req, res) => {
            if(req.user.role == 'ViewOnly'){
                res.status(401)
                throw new Error('You do not have permission to create a new Note');
            };
            
            if(!req.body.note || !req.body.status || !req.body.dueDate || !req.body.assignedUsers) {  // form validation
                res.status(400) 
                throw new Error ('Please add Notes');
            };

            // get the previous state so if the status changed from the last state then a note can be made also verify user has privilege edit this account
            const previousState = await openIssue.findById({_id: req.params.id})
                                                            .select('status dueDate active account provider')
                                                            .populate({ path: 'account', 
                                                            select: 'assignedUsers'
                                                            })
                                                            .populate({ path: 'provider', 
                                                            select: 'assignedUsers'
                                                            })

            let isAccountAssigned;
            if(previousState.account){

            previousState.account.assignedUsers.includes(req.user._id) == true ? isAccountAssigned = true : isAccountAssigned = false;
            }

            let isProviderAssigned;
            if(previousState.provider){

            previousState.provider.assignedUsers.includes(req.user.id) == true ? isProviderAssigned = true : isProviderAssigned = false
            }
            
            if( !isAccountAssigned && !isProviderAssigned ) {
            res.status(401)
            throw new Error('You do not have access to edit this account')
            };

            let { file } = req; // get the file from the middleware if user uploaded any
            if(!file) { // if no file uploaded save the request else save the request with the file info
                try {
                    const createNote = await openIssue.findByIdAndUpdate({_id: req.params.id},
                                                                            {
                                                                                $set: {
                                                                                    status: req.body.status,
                                                                                    dueDate: req.body.dueDate,
                                                                                    users: req.body.assignedUsers
                                                                                },
                                                                                $push: {
                                                                                    notes: {
                                                                                        user: req.user.id,
                                                                                        commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                                                                        note: req.body.note
                                                                                    },
                                                                                }
                                                                            },
                                                                            {new: true, upsert: true})
                                                                            .select('status dueDate notes')
                                                                            .where('notes').slice(-1);
                        
                        

                        if( previousState.status != createNote.status ||
                                previousState.dueDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                }) 
                                
                                != 
                                
                                createNote.dueDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                })
                        
                        ) {
                            const createNoteForChanges  = await openIssue.findByIdAndUpdate({_id: req.params.id },
                                                                                            { $push: {
                                                                                                    notes: {
                                                                                                        user : req.user.id,
                                                                                                        commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                                                                                        note : `${req.user.firstName + ' '+ req.user.lastName}  has changed the status to ${req.body.status} from ${previousState.status}  &  Due Date to ${req.body.dueDate} from ${previousState.dueDate.toLocaleDateString('en-US', {
                                                                                                            year: 'numeric',
                                                                                                            month: '2-digit',
                                                                                                            day: '2-digit',
                                                                                                        })}`,
                                                                                                    }
                                                                                                } 
                                                                                            },
                                                                                            { new: true, upsert: true })
                                                                                            .select('status dueDate notes')
                                                                                            .where('notes').slice(-2);
                                                
                    res.status(200).json(createNoteForChanges)

                    } else {
                        res.status(200).json(createNote)
                    }
                    
                    } catch (error) {
                    res.status(501)
                    throw new Error(error)
                }
            } else { // any file uploaded by the user

                try {
                    const { id } = file; // uploaded file id from the UploadMiddleware
                    const createNote = await openIssue.findByIdAndUpdate({_id: req.params.id},
                                                                            {
                                                                                $set: {
                                                                                    status: req.body.status,
                                                                                    dueDate: req.body.dueDate,
                                                                                    users: req.body.assignedUsers,
                                                                                },
                                                                                $push: {
                                                                                    notes: {
                                                                                        user: req.user.id,
                                                                                        commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                                                                        note: req.body.note,
                                                                                        fileID: id,
                                                                                        fileName: file.originalname
                                                                                    },
                                                                                }
                                                                            },
                                                                            {new: true, upsert: true})
                                                                            .select('status dueDate notes')
                                                                            .where('notes').slice(-1);
                        
                        

                        if( previousState.status != createNote.status ||
                                previousState.dueDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                }) 
                                
                                != 
                                
                                createNote.dueDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                })
                        
                        ) {
                            const createNoteForChanges  = await openIssue.findByIdAndUpdate({_id: req.params.id },
                                                                                            { $push: {
                                                                                                    notes: {
                                                                                                        user : req.user.id,
                                                                                                        commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                                                                                        note : `${req.user.firstName + ' '+ req.user.lastName}  has changed the status to ${req.body.status} from ${previousState.status}  &  Due Date to ${req.body.dueDate} from ${previousState.dueDate.toLocaleDateString('en-US', {
                                                                                                            year: 'numeric',
                                                                                                            month: '2-digit',
                                                                                                            day: '2-digit',
                                                                                                        })}`,
                                                                                                    }
                                                                                                } 
                                                                                            },
                                                                                            { new: true, upsert: true })
                                                                                            .select('status dueDate notes')
                                                                                            .where('notes').slice(-2);
                                                
                    res.status(200).json(createNoteForChanges)

                    } else {
                        res.status(200).json(createNote)
                    }
                    
                    } catch (error) {
                    res.status(501)
                    throw new Error(error)
                }
            }
}); 

// @Get all Notes in an Open Issues or Ticket
// @Route Get  /api/openIssues/getNotes/:id (openIssue id)
// @Access Private - All users who has access can access
const getCommentsOfIssues = asyncHandler(async (req, res) => {
    try {
        const comments = await openIssue.findById({_id: req.params.id}).select('notes')
        res.status(200).json(comments)
    } catch (error) {
        res.status(500)
        throw new Error('Not able to get the notes / comments from the records')
    }
});

module.exports = {
    createOpenIssues,
    updateOpenIssues,
    createCommentOnIssue,
    getCommentsOfIssues,
}
