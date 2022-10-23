'Use Strict'
const asyncHandler = require('express-async-handler');
const PIF = require('../models/pifModel');
const Account = require('../models/accountsModel');
const Provider = require('../models/providerModel');


// @Create PIF
// @Route Post   /api/pif/:id (account or provider id to which this will be created)
// @Access Private - Admin && User who are assigned to the account can create a new one...
const createPIF = asyncHandler(async(req, res) => {
    // user role validation
    if(req.user.role == 'ViewOnly') {
        res.status(401)
        throw new Error('You do not have access to edit this account / provider information.')
    }
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
    
    if (isAccountAssigned) {

            const {
                groupName, dba, taxID, taxClassification, businessStartDate, groupNPI, taxonomy,
                specialty, npiEnumerationDate, phone, fax, officeContactName, medicarePTAN, 
                medicaidID } = req.body;
                if (
                    !groupName, !taxID, !taxClassification, !businessStartDate, !groupNPI, !taxonomy,
                    !specialty, !npiEnumerationDate, !phone, !fax, !officeContactName
                ) {
                    res.status(401)
                    throw new Error('Please add all the required fields.')
                };

            // Managing address inputs
            const {
                location1Name, location1Type, location1addressLine1, location1addressLine2, location1city, location1state, location1countyOrParish ,location1zip,
                location2Name, location2Type, location2addressLine1, location2addressLine2, location2city, location2state, location2countyOrParish ,location2zip,
                location3Name, location3Type, location3addressLine1, location3addressLine2, location3city, location3state, location3countyOrParish ,location3zip,
                location4Name, location4Type, location4addressLine1, location4addressLine2, location4city, location4state, location4countyOrParish ,location4zip,
                location5Name, location5Type, location5addressLine1, location5addressLine2, location5city, location5state, location5countyOrParish ,location5zip,
            } = req.body;
                // form validation
                        if(location1Name && !location1Type || !location1addressLine1 || !location1addressLine2 || !location1city || !location1state 
                            || !location1countyOrParish  ||!location1zip) {
                                res.status(400)
                                throw new Error('Please provide all the fields in the Location 1')
                            };
                        if(location2Name && !location2Type || !location2addressLine1 || !location2addressLine2 || !location2city || !location2state 
                            || !location2countyOrParish  ||!location2zip) {
                                res.status(400)
                                throw new Error('Please provide all the fields in the Location 2')
                            };
                        if(location3Name && !location3Type || !location3addressLine1 || !location3addressLine2 || !location3city || !location3state 
                            || !location3countyOrParish  ||!location3zip) {
                                res.status(400)
                                throw new Error('Please provide all the fields in the Location 3')
                            };
                        if(location4Name && !location4Type || !location4addressLine1 || !location4addressLine2 || !location4city || !location4state 
                            || !location4countyOrParish  ||!location4zip) {
                                res.status(400)
                                throw new Error('Please provide all the fields in the Location 4')
                            };
                        if(location5Name && !location5Type || !location5addressLine1 || !location5addressLine2 || !location5city || !location5state 
                            || !location5countyOrParish  ||!location5zip) {
                                res.status(400)
                                throw new Error('Please provide all the fields in the Location 5')
                            };
            
            
            // Managing license inputs
            const {
                license1Type, license1Number, license1Effective, license1Expiry,
                license2Type, license2Number, license2Effective, license2Expiry,
                license3Type, license3Number, license3Effective, license3Expiry,
                license4Type, license4Number, license4Effective, license4Expiry,
                license5Type, license5Number, license5Effective, license5Expiry,
            } = req.body;
                    // form validation
                        if(license1Type && !license1Number || !license1Effective || !license1Expiry) {
                                res.status(400)
                                throw new Error('Please provide all the fields in the License section 01')
                            };
                        if(license2Type && !license2Number || !license2Effective || !license2Expiry) {
                            res.status(400)
                            throw new Error('Please provide all the fields in the License section 02')
                        };
                        if(license3Type && !license3Number || !license3Effective || !license3Expiry) {
                            res.status(400)
                            throw new Error('Please provide all the fields in the License section 03')
                        };
                        if(license4Type && !license4Number || !license4Effective || !license4Expiry) {
                            res.status(400)
                            throw new Error('Please provide all the fields in the License section 04')
                        };
                        if(license5Type && !license5Number || !license5Effective || !license5Expiry) {
                            res.status(400)
                            throw new Error('Please provide all the fields in the License section 05')
                        };
            
            
            // Manage Owners Info Input
            const {
                owner1FirstName, owner1MiddleName, owner1LastName, owner1OwnershipType, owner1OwnerShipPercentage,
                owner1Role, owner1SSN, owner1BirthPlaceAndCity, owner1HomeAddress, owner1ContactNumber, owner1ContactEmail,

                owner2FirstName, owner2MiddleName, owner2LastName, owner2OwnershipType, owner2OwnerShipPercentage,
                owner2Role, owner2SSN, owner2BirthPlaceAndCity, owner2HomeAddress, owner2ContactNumber, owner2ContactEmail,

                owner3FirstName, owner3MiddleName, owner3LastName, owner3OwnershipType, owner3OwnerShipPercentage,
                owner3Role, owner3SSN, owner3BirthPlaceAndCity, owner3HomeAddress, owner3ContactNumber, owner3ContactEmail,

                owner4FirstName, owner4MiddleName, owner4LastName, owner4OwnershipType, owner4OwnerShipPercentage,
                owner4Role, owner4SSN, owner4BirthPlaceAndCity, owner4HomeAddress, owner4ContactNumber, owner4ContactEmail,

                owner5FirstName, owner5MiddleName, owner5LastName, owner5OwnershipType, owner5OwnerShipPercentage,
                owner5Role, owner5SSN, owner5BirthPlaceAndCity, owner5HomeAddress, owner5ContactNumber, owner5ContactEmail
            } = req.body;
                // form validation
                        if(owner1FirstName && !owner1LastName || !owner1OwnershipType || !owner1OwnerShipPercentage ||
                            !owner1Role || !owner1SSN || !owner1BirthPlaceAndCity || !owner1HomeAddress || !owner1ContactNumber || !owner1ContactEmail) {
                            res.status(400)
                            throw new Error('Please provide all the fields in the 1st Owner section 01')
                        };
                        if(owner2FirstName && !owner2LastName || !owner2OwnershipType || !owner2OwnerShipPercentage ||
                            !owner2Role || !owner2SSN || !owner2BirthPlaceAndCity || !owner2HomeAddress || !owner2ContactNumber || !owner2ContactEmail) {
                            res.status(400)
                            throw new Error('Please provide all the fields in the 1st Owner section 02')
                        };
                        if(owner3FirstName && !owner3LastName || !owner3OwnershipType || !owner3OwnerShipPercentage ||
                            !owner3Role || !owner3SSN || !owner3BirthPlaceAndCity || !owner3HomeAddress || !owner3ContactNumber || !owner3ContactEmail) {
                            res.status(400)
                            throw new Error('Please provide all the fields in the 1st Owner section 03')
                        };
                        if(owner4FirstName && !owner4LastName || !owner4OwnershipType || !owner4OwnerShipPercentage ||
                            !owner4Role || !owner4SSN || !owner4BirthPlaceAndCity || !owner4HomeAddress || !owner4ContactNumber || !owner3ContactEmail) {
                            res.status(400)
                            throw new Error('Please provide all the fields in the 1st Owner section 04')
                        };
                        if(owner5FirstName && !owner5LastName || !owner5OwnershipType || !owner5OwnerShipPercentage ||
                            !owner5Role || !owner5SSN || !owner5BirthPlaceAndCity || !owner5HomeAddress || !owner5ContactNumber || !owner5ContactEmail) {
                            res.status(400)
                            throw new Error('Please provide all the fields in the 1st Owner section 05')
                        };
            
            // Managing license inputs
            const {
                bankName, accountType, accountNumber, routingNumber,
                bankContactName, bankAddress
            } = req.body;
                        // form !validation
                        if(!bankName && !accountType || !accountNumber || !routingNumber ||
                            !bankContactName || !bankAddress) {
                                res.status(400)
                                throw new Error('Please provide all the fields in the bank information section')
                            }

            
            // Manage Medical Directors Info
            const {
                medicalDirectorFirstName, medicalDirectorLastName, medicalDirectorSSN
            } = req.body;
                    // form validation
                    if(medicalDirectorFirstName && !medicalDirectorLastName || !medicalDirectorSSN ) {
                        res.status(400)
                        throw new Error('Please add all the fields in Medical Directors section.')
                    }
            

            // creating location object for each location provided
            class Location {
                    constructor(locationName, locationType, addressLine1, addressLine2, 
                                city, state, countyOrParish, zip) {
                        this.locationName = locationName;
                        this.locationType = locationType;
                        this.addressLine1 = addressLine1;
                        this.addressLine2 = addressLine2;
                        this.city = city;
                        this.state = state;
                        this.countyOrParish = countyOrParish;
                        this.zip = zip;
                    }
                    };
            let allLocations = [];
                    // evoking constructor function if all fields are given
                    if(location1Name && location1Type && location1addressLine1 && location1addressLine2 && location1city && location1state && location1countyOrParish && location1zip){
                        const location1 = new Location(location1Name, location1Type, location1addressLine1, location1addressLine2, location1city, location1state, location1countyOrParish ,location1zip,);
                        allLocations.push(location1);
                        
                    };

                    if(location2Name && location2Type && location2addressLine1 && location2addressLine2 && location2city && location2state && location2countyOrParish && location2zip){
                        const location2 = new Location(location2Name, location2Type, location2addressLine1, location2addressLine2, location2city, location2state, location2countyOrParish ,location2zip,);
                        allLocations.push(location2);
                        
                    };

                    if(location3Name && location3Type && location3addressLine1 && location3addressLine2 && location3city && location3state && location3countyOrParish && location3zip){
                        const location3 = new Location(location3Name, location3Type, location3addressLine1, location3addressLine2, location3city, location3state, location3countyOrParish ,location3zip,);
                        allLocations.push(location3);
                        
                    };

                    if(location4Name && location4Type && location4addressLine1 && location4addressLine2 && location4city && location4state && location4countyOrParish && location4zip){
                        const location4 = new Location(location4Name, location4Type, location4addressLine1, location4addressLine2, location4city, location4state, location4countyOrParish ,location4zip,);
                        allLocations.push(location4);
                        
                    };

                    if(location5Name && location5Type && location5addressLine1 && location5addressLine2 && location5city && location5state && location5countyOrParish && location5zip){
                        const location5 = new Location(location5Name, location5Type, location5addressLine1, location5addressLine2, location5city, location5state, location5countyOrParish ,location5zip,);
                        allLocations.push(location5);
                    };
            
                
                class License {
                    constructor(licenseType, licenseNumberOrID, licenseEffective, licenseExpiry, ) 
                    {
                        this.licenseType = licenseType;
                        this.licenseNumberOrID = licenseNumberOrID;
                        this.licenseEffective = licenseEffective;
                        this.licenseExpiry = licenseExpiry;
                    }
                    };
                let allLicenses = [];
    
                        if(license1Type && license1Number && license1Effective && license1Expiry){
                            const license1 = new License(license1Type, license1Number, license1Effective, license1Expiry);
                            allLicenses.push(license1);
                            
                        };

                        if(license2Type && license2Number && license2Effective && license2Expiry){
                            const license2 = new License(license2Type, license2Number, license2Effective, license2Expiry);
                            allLicenses.push(license2);
                        };

                        if(license3Type && license3Number && license3Effective && license3Expiry){
                            const license3 = new License(license3Type, license3Number, license3Effective, license3Expiry,);
                            allLocations.push(license3);
                        };

                        if(license4Type && license4Number && license4Effective && license4Expiry){
                            const license4 = new License(license4Type, license4Number, license4Effective, license4Expiry,);
                            allLicenses.push(license4);
                        };

                        if(license5Type && license5Number && license5Effective && license5Expiry){
                            const license5 = new License(license5Type, license5Number, license5Effective, license5Expiry,);
                            allLicenses.push(license5);
                            
                        };

                    
                    class Owner {
                        constructor(firstName, middleName, lastName, ownershipType, ownerShipPercentage,
                            role, ssn, birthPlaceAndCity, homeAddress, contactNumber, contactEmail ) 
                        {
                            this.firstName = firstName;
                            this.middleName = middleName;
                            this.lastName = lastName;
                            this.ownershipType = ownershipType;
                            this.ownerShipPercentage = ownerShipPercentage;
                            this.role = role;
                            this.ssn = ssn;
                            this.birthPlaceAndCity = birthPlaceAndCity;
                            this.homeAddress = homeAddress;
                            this.contactNumber = contactNumber;
                            this.contactEmail = contactEmail;
                        }
                        };

                    let allOwners = [];
                        if(owner1FirstName && owner1MiddleName && owner1LastName && owner1OwnershipType && owner1OwnerShipPercentage &&
                            owner1Role && owner1SSN && owner1BirthPlaceAndCity && owner1HomeAddress && owner1ContactNumber && owner1ContactEmail)
                            {
                            const owner1 = new Owner(owner1FirstName, owner1MiddleName, owner1LastName, owner1OwnershipType, owner1OwnerShipPercentage,
                                owner1Role, owner1SSN, owner1BirthPlaceAndCity, owner1HomeAddress, owner1ContactNumber, owner1ContactEmail);
                                allOwners.push(owner1);
                        };

                        if(owner2FirstName && owner2MiddleName && owner2LastName && owner2OwnershipType && owner2OwnerShipPercentage &&
                            owner2Role && owner2SSN && owner2BirthPlaceAndCity && owner2HomeAddress && owner2ContactNumber && owner2ContactEmail)
                            {
                            const owner2 = new Owner(owner2FirstName, owner2MiddleName, owner2LastName, owner2OwnershipType, owner2OwnerShipPercentage,
                                owner2Role, owner2SSN, owner2BirthPlaceAndCity, owner2HomeAddress, owner2ContactNumber, owner2ContactEmail);
                                allOwners.push(owner2);
                        };

                        if(owner3FirstName && owner3MiddleName && owner3LastName && owner3OwnershipType && owner3OwnerShipPercentage &&
                            owner3Role && owner3SSN && owner3BirthPlaceAndCity && owner3HomeAddress && owner3ContactNumber && owner3ContactEmail)
                            {
                            const owner3 = new Owner(owner3FirstName, owner3MiddleName, owner3LastName, owner3OwnershipType, owner3OwnerShipPercentage,
                                owner3Role, owner3SSN, owner3BirthPlaceAndCity, owner3HomeAddress, owner3ContactNumber, owner3ContactEmail);
                                allOwners.push(owner3);
                        };

                        if(owner4FirstName && owner4MiddleName && owner4LastName && owner4OwnershipType && owner4OwnerShipPercentage &&
                            owner4Role && owner4SSN && owner4BirthPlaceAndCity && owner4HomeAddress && owner4ContactNumber && owner4ContactEmail)
                            {
                            const owner4 = new Owner(owner4FirstName, owner4MiddleName, owner4LastName, owner4OwnershipType, owner4OwnerShipPercentage,
                                owner4Role, owner4SSN, owner4BirthPlaceAndCity, owner4HomeAddress, owner4ContactNumber, owner4ContactEmail);
                                allOwners.push(owner4);
                        };

                        if(owner5FirstName && owner5MiddleName && owner5LastName && owner5OwnershipType && owner5OwnerShipPercentage &&
                            owner5Role && owner5SSN && owner5BirthPlaceAndCity && owner5HomeAddress && owner5ContactNumber && owner5ContactEmail)
                            {
                            const owner5 = new Owner(owner5FirstName, owner5MiddleName, owner5LastName, owner5OwnershipType, owner5OwnerShipPercentage,
                                owner5Role, owner5SSN, owner5BirthPlaceAndCity, owner5HomeAddress, owner5ContactNumber, owner5ContactEmail);
                                allOwners.push(owner5);
                        };
                
                class BankDetails {
                    constructor(bankName, accountType, accountNumber, routingNumber, bankContactName, bankAddress) 
                    {
                        this.bankName = bankName;
                        this.accountType = accountType;
                        this.accountNumber = accountNumber;
                        this.routingNumber = routingNumber;
                        this.bankContactName = bankContactName;
                        this.bankAddress = bankAddress;
                    }
                    };
                let bankDetails;
                        if(bankName && accountType && accountNumber && routingNumber && bankContactName && bankAddress) {
                            bankDetails = new BankDetails(bankName, accountType, accountNumber, routingNumber, bankContactName, bankAddress)
                        };


                class MedicalDirector {
                    constructor(directorFirstName, directorLastName, directorSSN)
                    {
                        this.directorFirstName = directorFirstName;
                        this.directorLastName = directorLastName;
                        this.directorSSN = directorSSN
                    }
                };

                let medicalDirector;
                if(medicalDirectorFirstName && medicalDirectorLastName && medicalDirectorSSN) {
                    medicalDirector = new MedicalDirector(medicalDirectorFirstName, medicalDirectorLastName, medicalDirectorSSN);
                };

            // Creating a main object containing all the given info to push to the db
            class GroupInfo {
                constructor(groupName, dba, taxID, taxClassification, businessStartDate, groupNPI, taxonomy,
                    specialty, npiEnumerationDate, phone, fax, officeContactName, allLocations, allLicenses, allOwners, 
                    bankDetails, medicalDirector, medicarePTAN, medicaidID) {
                        this.groupName = groupName; // this is required
                        dba ? this.dba = dba : null, // this is optional
                        this.taxID = taxID;
                        taxClassification ? this.taxClassification = taxClassification : null,
                        businessStartDate ? this.businessStartDate = businessStartDate : null,
                        this.groupNPI = groupNPI;
                        taxonomy ? this.taxonomy = taxonomy : null,
                        specialty ? this.specialty = specialty : null,
                        npiEnumerationDate ? this.npiEnumerationDate = npiEnumerationDate : null,
                        phone ? this.phone = phone : null,
                        phone? this.fax = fax : null,
                        officeContactName ? this.officeContactName = officeContactName : null;
                        this.locations = allLocations;
                        this.licenseDetails = allLicenses;
                        this.ownersAndManagingEmployees = allOwners;
                        this.bankInfo = bankDetails;
                        medicalDirector ? this.medicalDirector = medicalDirector : null,
                        medicarePTAN ? this.medicarePTAN = medicarePTAN : null;
                        medicaidID ? this.medicaidID = medicaidID : null;
                    }
            };
            const groupInformation = new GroupInfo(groupName, dba, taxID, taxClassification, businessStartDate, groupNPI, taxonomy,
                specialty, npiEnumerationDate, phone, fax, officeContactName, allLocations, allLicenses, allOwners, bankDetails, 
                medicalDirector, medicarePTAN, medicaidID);

            // save to db
            try {
                const createPIF = await PIF.create({
                    name: groupName,
                    account: req.params.id,
                    accountInfo: groupInformation
                })

                res.status(200).json(createPIF)
            } catch (error) {
                
                res.status(501)
                throw new Error(error)
            }
    }
});


module.exports = {
    createPIF,
}





