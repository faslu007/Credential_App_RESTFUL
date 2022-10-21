const asyncHandler = require('express-async-handler');
const Account = require('../models/accountsModel');
const Provider = require('../models/providerModel');
const User = require('../models/userModel');
const InNetwork = require('../models/inNetworkModel');
const { exists } = require('../models/userModel');




// @Create In-Network Insurance
// @Route Post   api/inNetwork/:id
// @Access Private - Admin && User who are assigned to the account can create a new one...     
const createInNetwork = asyncHandler(async (req, res) => {
        const {insuranceName, assignedUsers, 
                trackingID, dueDate } = req.body;
                
        if(!insuranceName || !assignedUsers || !dueDate ) {
                res.status(400)
                throw new Error('Please add all the required fields')
            }
            
        if (req.user.role == 'ViewOnly') {
                res.status(401)
                throw new Error('You do not have permission to create new Insurance/payer')
        }
        
        let isAccountAssigned;
        if(req.user.role == 'Admin' || 'User') {
            const  account = await Account.findOne({_id: req.params.id}).select('assignedUsers')
            account && account.assignedUsers.includes(req.user.id) ? isAccountAssigned = account : isAccountAssigned = false; 
            
        }
        
        let isProviderAssigned;
        if(req.user.role.includes('Admin' || 'User') &&   !isAccountAssigned){
            const  provider = await Provider.findOne({_id: req.params.id}).select('assignedUsers') 
            console.log(provider)
            console.log(req.user._id)
            provider && provider.assignedUsers.includes(req.user.id) ? isProviderAssigned = provider : isProviderAssigned = false;
        }
        
        // Proper error message not going to client - need a little tweak
        if(!isAccountAssigned && !isProviderAssigned){
            res.status(401)
            throw new Error('You do not have access to this account or the requesting account does not exits')
        }

        
        if(isAccountAssigned){
            try {
                const insurance = await InNetwork.create({
                    insuranceName: insuranceName,
                    status: 'Pending',
                    assignedUsers: assignedUsers,
                    account: req.params.id,
                    dueDate: dueDate,
                });
                
                // create notes for account created eg: James Smith created new Insurance Molina Medicaid KY
                const notes  = await InNetwork.findByIdAndUpdate({_id: insurance.id },
                    { 
                        $push: {
                            notes: {
                                user : req.user.id,
                                commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                note : `${req.user.firstName} ${req.user.lastName} created new Insurance ${insurance.insuranceName}`,
                                
                            }
                        }
                    },
                    {new:true, upsert: true}
                    )
                res.status(200).json(insurance)
                
            } catch (error) {
                res.status(500).json(error)
            }
        }

        if(isProviderAssigned){
            try {
                const insurance = await InNetwork.create({
                    insuranceName: insuranceName,
                    status: 'Pending',
                    assignedUsers: assignedUsers,
                    provider: req.params.id,
                    dueDate: dueDate,
                });

                // create notes for account created eg: James Smith created new Insurance Molina Medicaid KY
                const notes  = await InNetwork.findByIdAndUpdate({_id: insurance.id },
                    { 
                        $push: {
                            notes: {
                                user : req.user.id,
                                commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                note : `${req.user.firstName} ${req.user.lastName} created new Insurance ${insurance.insuranceName}`,
                                
                            }
                        }
                    },
                    {new:true, upsert: true}
                    )

                res.status(200).json(insurance)
                
            } catch (error) {
            // unlike other validation unique property in MongoDB does not come with message parameter.... 
            // ....so manually passing the error message 
            error.message.includes('duplicate key error collection') ? (function(){throw new Error
                    ('Another Insurance already exists with the same name')}()) : null;
            res.status(500)
            throw new Error('Server error saving info to Database')
            }
        }
});

//@Update an In-network Insurance
//@Rote Put api/inNetwork
//@Access Private - Admin & User who assigned can modify
const updateInNetwork = asyncHandler(async (req, res) => {
        if(req.user.role == 'ViewOnly'){
            res.status(401)
            throw new Error('You do not have privilege to update Insurance, Please contact Admin')
        }
        const { insuranceName, status, assignedUsers, trackingID, dueDate, 
                active, description } = req.body;
            
        if(!insuranceName || !status || !assignedUsers || !trackingID
            || !dueDate || !active || !description){
                res.status(400)
                throw new Error('Please provide all the required fields')
        }
        
        try {
            const inNetwork = await InNetwork.findById(req.params.id)
                            .select('status dueDate active account provider')
                            .populate(
                            {
                                path: 'account',
                                select: 'assignedUsers'
                            })
                            .populate(
                            {
                                path: 'provider',
                                select: 'assignedUsers'
                            });
                            // this needs rework
            
            let isAccountAssigned;
            if(inNetwork.account){
                
                inNetwork.account.assignedUsers.includes(req.user._id) == true ? isAccountAssigned = true : isAccountAssigned = false;
            }
            
            let isProviderAssigned;
            if(inNetwork.provider){
                
                inNetwork.provider.assignedUsers.includes(req.user.id) == true ? isProviderAssigned = true : isProviderAssigned = false
            }
            
            if( !isAccountAssigned && !isProviderAssigned ) {
                res.status(401)
                throw new Error('You do not have access to edit this account')
            }
            // the Update
            const updatedInNetwork = await InNetwork.findOneAndUpdate(
                                            {_id: req.params.id},
                                            { '$set': { 'insuranceName': insuranceName, 'status': status,
                                                        'trackingID': trackingID, 'dueDate': dueDate, 'active': active,
                                                        'description': description}, "assignedUsers": req.body.assignedUsers,
                                            },
                            
                                {new: true, upsert: true}).select('-notes');

            // create notes for if status has changes: James Smith has changes the status to Submitted
            let note;
            if( inNetwork.status !== updatedInNetwork.status ) {
                    note = `${req.user.firstName +' '+ req.user.lastName} has made changes to the status ${'from ' + inNetwork.status +' to ' + updatedInNetwork.status}`

                    const notes  = await InNetwork.findByIdAndUpdate({_id: req.params.id },
                        { 
                            $push: {
                                notes: {
                                    user : req.user.id,
                                    commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                    note : note,
                                    
                                }
                            }
                        },
                        {new:true, upsert: true}
                        )
                } 
            if(updatedInNetwork){
                res.status(200).json(updatedInNetwork)
            }
        } catch (error) {
            res.status(500)
            throw new Error(error)
        }
})

// @Create Comment or notes to in-network insurances
// @Route POST   api/inNetwork/notes - Admins & Users who are assigned can CreateNotes
// @access private - Admin and Assigned users can Create Notes
// this evokes after uploading file if user uploaded any
// this will take file, note, status, assignedUsers & dueDate
const createComment = asyncHandler(async (req, res) => {
            
            if(!req.body.note || !req.body.status || !req.body.dueDate || !req.body.assignedUsers) {  // form validation
                res.status(400) 
                throw new Error ('Please add Notes');
            } 
            
            let { file } = req;
            if(!file) { // if file not uploaded runs the below code
                // add comment to in-network notes schema
                try {
                    const note  = await InNetwork.findByIdAndUpdate({_id: req.params.id },
                        { 
                            $push: {
                                notes: {
                                    user : req.user.id,
                                    commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                    note : req.body.note,
                                }
                            }
                        },
                        {new:true, upsert: true})
                        .select('_id status dueDate notes');

                        // Check if user is requesting any changes to current status || dueDate
                        const prevInNetworkState = note;
                        const prevStatus = prevInNetworkState.status;
                        const prevDueDate =  prevInNetworkState.dueDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            })

                    let isStatusOrDateChanged; //flag for the below turnery
                    prevStatus != req.body.status || prevDueDate != req.body.dueDate ? isStatusOrDateChanged = true : isStatusOrDateChanged = false;

            if( !isStatusOrDateChanged ){
                note.notes.slice(-2)
                const lastNotes = {_id: note._id, status: note.status, dueDate: note.dueDate, notes: note.notes.slice(-1)};
                
                res.status(200)
                .json(lastNotes)
            }
                
        // update the status and assigned users, if any changes requested... 
        // ...User can change the In-network Insurance status / assigned users while adding a comment
            if( isStatusOrDateChanged ) {
                const changesSaved = await InNetwork.findOneAndUpdate(
                    { '_id': req.params.id },
                    { '$set': { 'status': req.body.status, 
                                'dueDate': req.body.dueDate, 
                                'assignedUsers': req.body.assignedUsers,
                                }},
                                {new: true, upsert: true})
                                
            if( changesSaved ) {
                // creates new comment / note for changes made
                const notes  = await InNetwork.findByIdAndUpdate({_id: req.params.id },
                    { $push: {
                            notes: {
                                user : req.user.id,
                                commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                note : `${req.user.firstName + ' '+ req.user.lastName}  has changed the status to ${req.body.status} from ${prevStatus}  &  Due Date to ${req.body.dueDate} from ${prevDueDate}`,
                            }
                        } 
                    },
                    { new: true, upsert: true })
                    .select('status dueDate notes')
                    
                    const sendUpdatesToUser = {_id: notes._id, status: notes.status, dueDate: notes.dueDate, notes: notes.notes.slice(-2)};
                    res.status(200).json(sendUpdatesToUser)
                    }
        } 
    } catch (error) {
            res.status(401)
            throw new Error('An error occured while adding the notes')
        }
    } else {
        // if any file got uploaded then updating the file id along with the comment/notes
    //     const { file } = req;
            const { id } = file;
                if(!req.body.note || !req.body.status || !req.body.dueDate || !req.body.assignedUsers) {  // form validation
                                res.status(400) 
                                throw new Error ('Please add Notes');
                            } 
    // add comment to in-network notes schema along with uploaded fileID
            try {
                const note  = await InNetwork.findByIdAndUpdate({_id: req.params.id },
                    { 
                        $push: {
                            notes: {
                                user : req.user.id,
                                commenterName: req.user.name,
                                note : req.body.notes,
                                fileID: id,
                                fileName: file.originalname
                            }
                        }
                    },
                    {new:true, upsert: true})
                    .select('_id status dueDate notes');
                    
                        // Check if user is requesting any changes to current status || dueDate
                        const prevInNetworkState = note;
                        const prevStatus = prevInNetworkState.status;
                        const prevDueDate =  prevInNetworkState.dueDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            })
                            
                let isStatusOrDateChanged; //flag for the below turnery
                prevStatus != req.body.status || prevDueDate != req.body.dueDate ? isStatusOrDateChanged = true : isStatusOrDateChanged = false;
                
                if( !isStatusOrDateChanged ){
                    note.notes.slice(-2)
                    const lastNotes = {_id: note._id, status: note.status, dueDate: note.dueDate, notes: note.notes.slice(-1)};
                    
                    res.status(200)
                    .json(lastNotes)
                }
        
                // update the status and assigned users, if any changes requested... 
                // ...User can change the In-network Insurance status / assigned users while adding a comment
                if( isStatusOrDateChanged ) {
                    const changesSaved = await InNetwork.findOneAndUpdate(
                        { '_id': req.params.id },
                        { '$set': { 'status': req.body.status, 
                                    'dueDate': req.body.dueDate, 
                                    'assignedUsers': req.body.assignedUsers,
                                    }},
                                    {new: true, upsert: true})

                            
                if( changesSaved ) {
                    // creates new comment / note for changes made
                    const notes  = await InNetwork.findByIdAndUpdate({_id: req.params.id },
                        { $push: {
                                notes: {
                                    user : req.user.id,
                                    commenterName: `${req.user.firstName} ${req.user.lastName}`,
                                    note : `${req.user.firstName + ' '+ req.user.lastName}  has changed the status to ${req.body.status} from ${prevStatus}  &  Due Date to ${req.body.dueDate} from ${prevDueDate}`,
                                }
                            } 
                        },
                        { new: true, upsert: true })
                        .select('status dueDate notes')
                        
                        const sendUpdatesToUser = {_id: notes._id, status: notes.status, dueDate: 
                                                    notes.dueDate, notes: notes.notes.slice(-2)};
                                                    
                        res.status(200).json(sendUpdatesToUser)
                        }
    } 
} catch (error) {
    res.status(401)
    throw new Error('An error occured while adding the notes')
}
    }
});




// |||Module pending to code|||
// @Get all comments / notes pertains to the insurance user requesting
// @Route GET   api/inNetwork/notes/:id
// @access private
    // need to code user privilege validation
const getComments = asyncHandler(async (req, res) => {
    try {
        const comments  = await InNetwork.findById({_id: req.params.id }).select('notes').select('status').select('user').populate('user',{'name':1})    
        res.status(200).json(comments);
    } catch (error) {
            res.status(401).json(error);
        }
});



// @GET All In-network Insurance List which user has access to
// @Route Get api/inNetwork
// @access private
    // User privilage validation pending to code
    const getAllInNetworks = asyncHandler( async (req, res) => {
        // Get the In-network insurance list if requested for an Account / Facility
    const inNetworkInsurances = await InNetwork.find({account: req.params.id}).select('-notes').select('-createdAt');
        // find the In-network insurance list if requested for Individual Provider / HealthcareStaff
    if(inNetworkInsurances.length >= 1){
        res.status(200).json(inNetworkInsurances);
    } else { // if insurance not found for the Account / Facility then check for the Provider/HealthStaff
        const inNetworkInsurances = await InNetwork.find({provider: req.params.id}).select('-notes').select('-createdAt');
        inNetworkInsurances.length >= 1 ? res.status(200).json(inNetworkInsurances) : res.status(400).json({message:"Group/Facility/Provider not found for the requested ID"})
    }
});


module.exports = {
    createInNetwork,
    updateInNetwork,
    getAllInNetworks,
    createComment,
    getComments
}