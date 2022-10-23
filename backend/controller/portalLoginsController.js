"use strict";
const asyncHandler = require('express-async-handler');
const Account = require('../models/accountsModel');
const Provider = require('../models/providerModel');
const PortalLogins = require('../models/portalLoginsModel');


// @Create a Portal Login under and account or Provider
// @Route Post   /api/portalLogins/:id (account or provider id to which this will be created)
// @Access Private - Admin && User who are assigned to the account can create a new one...
const createPortalLogin = asyncHandler(async (req, res) => {
            if(req.user.role == 'ViewOnly'){
                res.status(401)
                throw new Error('You do not have access to edit this account');
            };

            const {portalName, userName, registeredEmail, password, 
                link, securityQuestion1, securityQuestion1Answer,
                securityQuestion2, securityQuestion2Answer,
                securityQuestion3, securityQuestion3Answer,
                securityQuestion4, securityQuestion4Answer  } = req.body;

            class SecurityQA {
                constructor(question, answer) {
                    this.securityQuestion = question;
                    this.answer = answer;
                }
                }
                let allQA = [];
                let securityQA1;
                if(securityQuestion1 && securityQuestion1Answer){
                    securityQA1 = new SecurityQA(securityQuestion1, securityQuestion1Answer);
                    securityQA1.securityQuestion ? allQA.push(securityQA1) : null;
                };
                let securityQA2;
                if(securityQuestion1 && securityQuestion1Answer){
                    securityQA2 = new SecurityQA(securityQuestion2, securityQuestion2Answer);
                    securityQA2.securityQuestion ? allQA.push(securityQA2) : null;
                };
                let securityQA3;
                if(securityQuestion1 && securityQuestion1Answer){
                    securityQA3 = new SecurityQA(securityQuestion3, securityQuestion3Answer);
                    securityQA3.securityQuestion ? allQA.push(securityQA3) : null;
                };
                let securityQA4;
                if(securityQuestion1 && securityQuestion1Answer){
                    securityQA4 = new SecurityQA(securityQuestion4, securityQuestion4Answer);
                    securityQA4.securityQuestion ? allQA.push(securityQA4) : null;
                };

        
            let isAccountAssigned;
            if(req.user.role == 'Admin' || 'User') {
                const  account = await Account.findOne({_id: req.params.id}).select('assignedUsers')
                account && account.assignedUsers.includes(req.user.id) ? isAccountAssigned = account : isAccountAssigned = false; 
                
            }
            
            let isProviderAssigned;
            if(req.user.role == 'Admin' || 'User' &&   !isAccountAssigned){
                
                const  provider = await Provider.findOne({_id: req.params.id}).select('assignedUsers') 
                provider && provider.assignedUsers.includes(req.user.id) ? isProviderAssigned = provider : isProviderAssigned = false;
            }
            
            // Proper error message not going to client - need a little tweak
            if(!isAccountAssigned && !isProviderAssigned){
                res.status(401)
                throw new Error('You do not have access to this account or the requesting account does not exits')
            };
            
            if(isAccountAssigned) {
                try {
                        const portalLogin = await PortalLogins.create({
                            portalName: portalName,
                            userName: userName,
                            registeredEmail: registeredEmail,
                            addedBy: `${req.user.firstName} ${req.user.lastName}`,
                            account: isAccountAssigned ? req.params.id : req.params.id,
                            password: password,
                            link: link,
                            securityQuestions: allQA
                        },
                        {new: true})
                    res.status(200).json(portalLogin)
                } catch (error) {
                    console.log(error)
                    res.status(501)
                    throw new Error('Error saving records to database')
                }
            };
            if(isProviderAssigned) {
                try {
                        const portalLogin = await PortalLogins.create({
                            portalName: portalName,
                            userName: userName,
                            registeredEmail: registeredEmail,
                            addedBy: `${req.user.firstName} ${req.user.lastName}`,
                            provider: req.params.id,
                            password: password,
                            link: link,
                            securityQuestions: allQA
                        },
                        {new: true})
                    res.status(200).json(portalLogin)
                } catch (error) {
                    console.log(error)
                    res.status(501)
                    throw new Error('Error saving records to database')
                }
            };
});


module.exports = {
    createPortalLogin
}