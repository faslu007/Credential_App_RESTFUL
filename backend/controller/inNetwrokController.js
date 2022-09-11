const asyncHandler = require('express-async-handler');
const Account = require('../models/accountsModel');
const User = require('../models/userModels');
const InNetwork = require('../models/inNetworkModel');


// @GET All In-network Insurance List which user has access to
// @Route Get api/inNetwork
// @access private
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


// @Create In-Network Insurance
// @Route Post   api/inNetwork
// @access private
// handles insurance create request for both Group and Individual Providers
const createInNetwork = asyncHandler(async (req, res) => {
    if(!req.body.insuranceName) {  // form validation
        res.status(400) 
        throw new Error ('please add insurance name');
    }
    // validates if the id recieved matches the account if not req passes to add the insurance to provider
    const accountExistis = await Account.findById(req.body.providerOrAccount);

    if (accountExistis != null) {
    try {
        const insurance  = await InNetwork.create({
            insuranceName: req.body.insuranceName,
            status: req.body.status,
            account: req.body.providerOrAccount,
            dueDate: req.body.dueDate,
        })

        assignedUsers = req.body.assignedUsers;
        
        // Push assigned users to the model
        if(assignedUsers.length >=1){
            for (let i = 0; i < assignedUsers.length; i++) {
                const addUsers = await InNetwork.updateOne(
                    { _id: insurance.id },
                    { $push: { user: [assignedUsers[i]] } },
                    { upsert: true }
                );   
            }
        }

        const returnInsurance = await InNetwork.findById(insurance._id).select('-notes').select('-createdAt') 
        
        res.status(200).json(returnInsurance);
    } catch (error) {
            res.status(401).json(error);
        }
   } else {
    try {
        const insurance  = await InNetwork.create({
            insuranceName: req.body.insuranceName,
            status: req.body.status,
            provider: req.body.providerOrAccount,
            dueDate: req.body.dueDate,
        })
        assignedUsers = req.body.assignedUsers;
        // Push assigned users to the model
        if(assignedUsers.length >=1){
            for (let i = 0; i < assignedUsers.length; i++) {
                const addUsers = await InNetwork.updateOne(
                    { _id: insurance.id },
                    { $push: { user: [assignedUsers[i]] } },
                    { upsert: true }
                );   
            }
        }
        const returnInsurance = await InNetwork.findById(insurance.id).select('-notes').select('-createdAt') 
        
        res.status(200).json(returnInsurance);
    } catch (error) {
            res.status(401).json(error);
        }
   } 
});



// @Create Comment or notes to in-network insurances
// @Route POST   api/inNetwork/notws
// @access private
// this evokes after uploading file / checking file exists
const createComment = asyncHandler(async (req, res) => {
    let { file } = req;
    // checks if user uploaded any files and successfully uploaded?:  if file exists.... 
    // .... its already uploaded by fileUpload middleware and here recieves the fileInfo to save to the notesSchema
    if(!file) { // if file not uploaded runs the below code
    if(!req.body.notes) {  // form validation
        res.status(400) 
        throw new Error ('please add comments');
    } 
    // add comment to in-network notes schema
    try {
        const notes  = await InNetwork.findByIdAndUpdate({_id: req.params.id },
            { 
                $push: {
                    notes: {
                        user : req.user.id,
                        commenterName: req.user.name,
                        note : req.body.notes,
                    }
                }
            },
            { upsert: true } 
            )
        
        // update the status and assigned users, if any changes requested... 
        // ...User can change the In-network Insurance status / assigned users while adding a comment
        if(req.body.status || req.body.assignedUsers) {
            const updateUserandStatus = await InNetwork.findById(req.params.id).select('status').select('user')
            
            // updates are made if the current status is changed
            if(updateUserandStatus.status !== req.body.status) {
                const updateStatus = await InNetwork.findByIdAndUpdate(req.params.id, { status: req.body.status })
                // creates new comment / note for the status change
                const notes  = await InNetwork.findByIdAndUpdate({_id: req.params.id },
                    { 
                        $push: {
                            notes: {
                                user : req.user.id,
                                commenterName: req.user.name,
                                note : `${req.user.name} has changed the status to ${req.body.status} from ${updateStatus.status}`,
                            }
                        }
                    },
                    { upsert: true } 
                    )
            }
            if (req.body.assignedUsers) {    
                
                let idRecieved = req.body.assignedUsers;
                let idinDBExists = updateUserandStatus.user
                const idNotInDb = idRecieved.filter(x => !idinDBExists.includes(x)) 
                
                for (let i = 0; i < idNotInDb.length; i++) {
                    const pushUserstoProvider = await InNetwork.updateOne(
                        { _id: req.params.id },
                        { $push: { user: idNotInDb[i] } },
                        { upsert: true }
                    );
                }
            }
            
        } 
        
        // Send added comment back to User
        const returnComment = await InNetwork.findById(notes.id).select('notes')
        const lastComment = returnComment.notes.slice(-1)
        res.status(200).json(lastComment);
    } catch (error) {
            res.status(401).json(error);
        }
    } else {
        // if any file got uploaded then updating the file id along with the comment/notes
    //     const { file } = req;
    const { id } = file;
    if(!req.body.notes) {  // form validation
        res.status(400) 
        throw new Error ('please add comments');
    } 
    // add comment to in-network notes schema along with uploaded fileID
    try {
        const notes  = await InNetwork.findByIdAndUpdate({_id: req.params.id },
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
            { upsert: true } 
            )
        
        // update the status and assigned users, if any changes requested
        if(req.body.status || req.body.assignedUsers) {
            const updateUserandStatus = await InNetwork.findById(req.params.id).select('status').select('user')
            if(updateUserandStatus.status !== req.body.status) {
                const updateStatus = await InNetwork.findByIdAndUpdate(req.params.id, { status: req.body.status })
                // creates new comment / note for the status change
                const notes  = await InNetwork.findByIdAndUpdate({_id: req.params.id },
                    { 
                        $push: {
                            notes: {
                                user : req.user.id,
                                commenterName: req.user.name,
                                note : `${req.user.name} has changed the status to ${req.body.status} from ${updateStatus.status}`,
                            }
                        }
                    },
                    { upsert: true } 
                    )
            }
            if (req.body.assignedUsers) {    
                // save the assigned user_id if the requested id not there in the DB
                let idRecieved = req.body.assignedUsers;
                let idInDBExists = updateUserandStatus.user
                const idNotInDb = idRecieved.filter(x => !idInDBExists.includes(x)) // filtering the user_id recieved wich is not there in the idinDBExists
                
                for (let i = 0; i < idNotInDb.length; i++) {
                    const pushUserstoInNetwork = await InNetwork.updateOne(
                        { _id: req.params.id },
                        { $push: { user: idNotInDb[i] } },
                        { upsert: true }
                    );
                }
            }
        }
        // NEED IMPROVISATION: SHOULD SEND THE UPDATED STATUS AND USERS ALONG  WITH THE LAST COMMENT
        // Send added comment back to User
        const returnComment = await InNetwork.findById(notes.id).select('notes')
        const lastComment = returnComment.notes.slice(-1)
        res.status(200).json(lastComment);
    } catch (error) {
            res.status(401).json(error);
        }
    }
});





// @Get all comments / notes pertains to the insurance user requesting
// @Route GET   api/inNetwork/notes/:id
// @access private
const getComments = asyncHandler(async (req, res) => {
    try {
        const comments  = await InNetwork.findById({_id: req.params.id }).select('notes').select('status').select('user').populate('user',{'name':1})    
        res.status(200).json(comments);
    } catch (error) {
            res.status(401).json(error);
        }
});



module.exports = {
    getAllInNetworks,
    createInNetwork,
    createComment,
    getComments
}