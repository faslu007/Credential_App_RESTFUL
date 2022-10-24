const mongoose = require('mongoose');


const medicalDirectorSchema = mongoose.Schema({
    directorFirstName: {
        type: String,
        require: true,
        trim: true,
        max: 30
    },
    directorLastName: {
        type: String,
        require: true,
        trim: true,
        max: 30
    },
    directorSSN: {
        type: String,
        require: true,
        trim: true,
        minlength: [9, 'Minimum 9 digits required to Save SSN'],
        maxlength: [9, 'Maximum 9 digits allowed to save a SSN'],
    },
})

const bankInfoSchema = mongoose.Schema({
        bankName: {
            type: String,
            require: true,
            trim: true,
            max: 50,
        },
        accountType: {
            type: String,
            enum: ['Checking', 'Saving', 'Other'],
            require: true
        },
        accountNumber: {
            type: Number,
            trim: true,

        },
        routingNumber: {
            type: Number,
            trim: true,
        },
        bankContactName: {
            type: String,
            max: 70,
            trim: true
        },
        bankAddress: {
            require: true,
            type: String,
            max: 120,
        } 
})


const ownersAndManagingEmployeesSchema = mongoose.Schema({
    firstName: {
        type: String,
        max: 50,
        require: [true, 'Please add owners First Name.'],
        trim: true
    },
    middleName: {
        type: String,
        max: 50,
        trim: true
    },
    lastName: {
        type: String,
        max: 50,
        require: [true, 'Please add owners Last Name.'],
        trim: true
    },
    ownershipType: {
        type: String,
        require: true,
        enum: ['Direct Owner', 'Indirect-Ownership', 'Managing-Employee', 'Administrator']
    },
    ownerShipPercentage: {
        require: true,
        type: Number,
    },
    role: {
        type: String,
        max: 20,
        trim: true
    },
    ssn: {
        type: String,
        trim: true,
        maxlength: [9, 'Maximum 9 digits allowed in SSN'],
        maxlength: [9, 'Minimum 9 digits required in SSN'],
    },
    birthPlaceAndCity: {
        type: String,
        trim: true,
        max: 50
    },
    homeAddress: {
        type: String,
        max: 120,
        trim: true
    },
    contactNumber: {
        type: Number,
        trim: true
    },
    contactEmail: {
        type: String,
        max: 60,
        trim: true
    }
})

const licenseSchema = mongoose.Schema({
    licenseType: {
        type: String,
        max: [25, 'License Type - Exceeds Maximum allowed characters : 25'],
        trim: true,
        require: true,
    },
    licenseNumberOrID: {
        type: String,
        require: [true, 'License number is required.'],
        trim: true,
        max: [25, 'License Number - Exceeds Maximum allowed characters : 25']
    },
    licenseEffective: {
        type: Date,
        trim: true,
        require: [true, 'Please provide license effective date']
    },
    licenseExpiry: {
        type: Date,
        trim: true,
    },
})




const locationSchema = mongoose.Schema({
    locationName: {
        type: String,
        max: 20,
        trim: true,
    },
    locationType: {
        type: String,
        enum: ['Primary, Billing & Mailing Address','Primary', 'Billing', 'Mailing',
                'Additional Service Location'],
    },
    addressLine1: {
        type: String,
        max: 25,
        trim: true,
        require: true
    },
    addressLine2: {
        type: String,
        max: 25,
        trim: true,
    },
    city: {
        type: String,
        max: 25,
        require: true,
        trim: true
    },
    state: {
        type: String,
        max: 25,
        require: true,
        trim: true
    },
    countyOrParish: {
        type: String,
        max: 25,
        require: [true,'Please add a County or Parish'],
        trim: true
    },
    zip: {
        type: Number,
        require: [true,'Please add Zip code'],
    }
});


//Provider License Schema which is different from the Group/Facility Licenses
const providerLicensesSchema = mongoose.Schema({
    licenseType: {
        type: String,
        require: true,
        enum: ['State', 'DEA', 'Board-Certification', 'Other' ],
        max: 25
    },
    licenseNumber: {
        type: String,
        require: true,
        trim: true,
        max: 25
    },
    otherLicense: {
        type: String,
        trim: true,
        max: [30, 'Min 20 characters allowed'],
    },
    licenseState: {
        type: String,
        max: 25,
        trim: true
    },
    licenseEffective: {
        type: Date,
        trim: true,
        require: [true, 'Please provide license effective date']
    },
    licenseExpiry: {
        type: Date,
        trim: true,
    },
});

// Provider locations schema
const providerServiceLocationsSchema = mongoose.Schema({
    locationName: {
        type: String,
        max: 20,
        trim: true,
    },
    locationType: {
        type: String,
        enum: ['Primary', 'Secondary','Tertiary', 'Forth', 'Fifth',],
        require: true
    },
    addressLine1: {
        type: String,
        max: 25,
        trim: true,
        require: true
    },
    addressLine2: {
        type: String,
        max: 25,
        trim: true,
    },
    city: {
        type: String,
        max: 25,
        require: true,
        trim: true
    },
    state: {
        type: String,
        max: 25,
        require: true,
        trim: true
    },
    countyOrParish: {
        type: String,
        max: 25,
        require: [true,'Please add a County or Parish'],
        trim: true
    },
    zip: {
        type: Number,
        require: [true,'Please add Zip code'],
    }
})


const providerInfoSchema = mongoose.Schema({
    providerFirstName: {
        type: String,
        trim: true,
        require: true,
        max: 50
    },
    providerMiddleName: {
        type: String,
        trim: true,
        require: true,
        max: 50
    },
    providerLastName: {
        type: String,
        trim: true,
        require: true,
        max: 50
    },
    providerNPI: {
        type: String,
        max: 10,
        trim: true
    },
    providerSSN: {
        type: String,
        trim: true,
        max: 50
    },
    taxonomy: {
        type: String,
        max: 20,
        trim: true,
    },
    specialty: {
        type: String,
        max: 30,
        trim: true,
    },
    caqhNumber: {
        type: String,
        max: 15,
        trim: true
    },
    providerRole: {
        type: String,
        enum: ['PCP', 'Specialist', 'Ordering/Prescribing'],
        trim: true
    },
    providerTitle: {
        type: String,
        max: 30,
        trim: true
    },
    providerContactNumber: {
        type: String,
        max: 15,
        trim: true
    },
    providerContactEmail: {
        type: String,
        max: 15,
        trim: true
    },
    medicarePTAN: {
        type: String,
        max: 10,
        trim: true,
    },
    medicaidID: {
        type: String,
        max: 15,
        trim: true,
    },
    serviceLocations: [providerServiceLocationsSchema],
    providerLicenses: [providerLicensesSchema],
    hospitalAffiliations: [{
        type: String,
        trim: true,
        max: [100, 'Exceeds maximum allowed character length: 100']
    }],
})




const accountInfoSchemaSchema = mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        max: 30,
        trim: true
    },
    dba: {
        type: String,
        max: 30,
        trim: true
    },
    taxID: {
        type: String,
        minlength: 9,
        maxlength: 9
    },
    taxClassification: {
        type: String,
        enum: ['Single Member LLC', 'Sole Proprietorship/Individual',
                'C-Corporation', 'S-Corporation', 'Partnership', 'Trust/Estate',
                'LLC- Corp', 'LLC S-Corp', 'LLC-Partnership', 'Other'],
    },
    businessStartDate: {
        type: String,
        trim: true,
        max: 15,
    },
    groupNPI: {
        type: String,
        minlength: 10,
        maxlength: 10,
        trim: true
    },
    taxonomy: {
        type: String,
        max: [20, 'Min 20 characters allowed'],
        trim: true,
    },
    specialty: {
        type: String,
        max: 30,
        trim: true,
    },
    npiEnumerationDate: {
        type: String,
        max: 10,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    fax: {
        type: String,
        trim: true,
    },
    officeContactName: {
        type: String,
        trim: true,
        max: 30,
    },
    locations: [locationSchema],
    medicarePTAN: {
        type: String,
        max: 10,
        trim: true,
    },
    medicaidID: {
        type: String,
        max: 15,
        trim: true,
    },
    licenseDetails: [licenseSchema],
    ownersAndManagingEmployees: [ownersAndManagingEmployeesSchema],
    bankInfo: bankInfoSchema,
    medicalDirector: medicalDirectorSchema,
}, {
    timestamps: true
})


const pifSchema = mongoose.Schema({
        name: {
            type: String,
            max: 20,
            trim: true,
            unique: true,
        },
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Provider',
        },
        accountInfo: accountInfoSchemaSchema,
        providerInfo: providerInfoSchema,
},
{
    timestamps: true,
});


module.exports = mongoose.model('PIF', pifSchema)
