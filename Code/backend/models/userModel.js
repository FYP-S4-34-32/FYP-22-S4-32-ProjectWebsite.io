// Enforcing schema for mongodb
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // unique username/email
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

// static signup method - has to be regular function instead of arrow function because of the usage of 'this' keyword
userSchema.statics.signup = async function(email, password) {
    /* validation */
    // email or password is empty
    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    // whether it is a valid email
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }

    // strength of password
    // if (!validator.isStrongPassword(password)) {
    //     throw Error('Password not strong enough')
    // }

    // check whether email exist in the database
    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }

    /* save user to the database */
    // generate password salt - value determines strength --> default == 10
    const salt = await bcrypt.genSalt(10)

    // hash the password
    const hash = await bcrypt.hash(password, salt)

    // const user = await this.create({ email, password: hash })
    const user = await this.create({ email, password })

    return user
}

// static login method
userSchema.statics.login = async function(email, password) {
    // validation - email and/or password empty
    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ email })

    // if user not found
    if (!user) {
        throw Error('Invalid login credentials')
    }

    // // if user found - try to match password
    // const match = await bcrypt.compare(password, user.password) // (password passed in, password in the db)

    // // if no match
    // if (!match) {
    //     throw Error('Invalid login credentials')
    // }

    // for development only - change to hash above before deployment
    if (password !== user.password)
    {
        throw Error('Invalid login credentials')
    }

    return user
}

// ----------------------------------------------------------
// Admin user schema
// ----------------------------------------------------------

const adminSchema = new Schema({
    adminEmail: {
        type: String,
        required: true,
        unique: true // unique username/email
    },  
    adminPassword: {
        type: String,
        required: true
    }
}, {timestamps: true});

adminSchema.login = async function(adminEmail, adminPassword) {
    // validation - email and/or password empty
    if (!adminEmail || !adminPassword) {
        throw Error('All fields must be filled')
    }

    const admin = await this.findOne({ adminEmail })

    // if user not found
    if (!admin) {
        throw Error('Invalid login credentials')
    }
 
    // for development only - change to hash above before deployment
    if (adminPassword !== admin.adminPassword)
    {
        throw Error('Invalid login credentials')
    }

    return admin
}

// ----------------------------------------------------------
// Super admin user schema
// ----------------------------------------------------------

const superAdminSchema = new Schema({
    superAdminEmail: {
        type: String,
        required: true,
        unique: true // unique username/email
    },
    superAdminPassword: {
        type: String,
        required: true
    }
}, {timestamps: true});

superAdminSchema.login = async function(superAdminEmail, superAdminPassword) {
    // validation - email and/or password empty
    if (!superAdminEmail || !superAdminPassword) {
        throw Error('All fields must be filled')
    }

    const superAdmin = await this.findOne({ superAdminEmail })
    
    // if super admin not found
    if (!superAdmin) {
        throw Error('Invalid login credentials')
    }

    
    // for development only - change to hash above before deployment
    if (superAdminPassword !== superAdmin.superAdminPassword) {
        throw Error('Invalid login credentials')
    }

    return superAdmin
}


// ----------------------------------------------------------
// Export the modules
// ----------------------------------------------------------

// .model builds out a Collection
module.exports = mongoose.model('User', userSchema)
module.exports = mongoose.model('Admin', adminSchema)
module.exports = mongoose.model('SuperAdmin', superAdminSchema)