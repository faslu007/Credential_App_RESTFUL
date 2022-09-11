const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const user = require('../models/userModels');

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith ('Bearer')){
        try {
            // get token from the header
            token = req.headers.authorization.split(' ')[1]

            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            // get the user from the token
            req.user = await user.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error ('Not autherized, no token');
        }
    }
    if (!token) {
        res.status(401)
        throw new Error ('Not autherized')
    }
})


module.exports = {protect};