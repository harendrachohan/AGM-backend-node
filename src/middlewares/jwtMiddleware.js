const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const {AppError} = require('../utils/errorHandler');
const env = require('dotenv').config();
const jwtToken = process.env.JWT_TOKEN_KEY;
/**
 * Super Admin Auth
 */
exports.superAdminAuth  = catchAsync(async (req, res, next) => {
    try {
        // check header or url parameters or post parameters for token      
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        // decode token
        if (!token) return next(new AppError("No token provided", 401));

        // verifies secret and checks exp
        const decoded = await jwt.verify(token, jwtToken)

        if(!decoded) return next(new AppError("session Expired", 401));

        //verify token wheather user exist or not
        let userData = await Admin.findById( decoded.id);
        if(userData == null) return next(new AppError("user unauthenticated", 401));        
        if(userData.type != 1) return next(new AppError("Forbidden", 403));
        next();

    } catch (err) {
        if (err.message === "jwt expired")   return next(new AppError("session Expired", 401));
        if (err.name === "TokenDestroyedError")   return next(new AppError('token Destroyed Error', 401));
        return next({ message: err.message });
    }
})
 


/**
 * Admin Auth Middlware
 */
exports.adminAuth  = catchAsync(async (req, res, next) => {
    try {
        // check header or url parameters or post parameters for token      
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        // decode token
        if (!token) return next(new AppError("No token provided", 401));

        // verifies secret and checks exp
        const decoded = await jwt.verify(token, jwtToken)

        if(!decoded) return next(new AppError("session Expired", 401));

        //verify token wheather user exist or not
        let userData = await Admin.findById(decoded.id);        
        if(userData == null) return next(new AppError("user unauthenticated", 401));

        req.user = userData;

        next();

    } catch (err) {
        if (err.message === "jwt expired")   return next(new AppError("session Expired", 401));
        if (err.name === "TokenDestroyedError")   return next(new AppError('token Destroyed Error', 401));
        return next({ message: err.message });
    }
})

/**
 * 
 */
exports.userAuth  = catchAsync(async (req, res, next) => {
    try {
        // check header or url parameters or post parameters for token      
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        // decode token
        if (!token) return next(new AppError("No token provided", 401));

        // verifies secret and checks exp
        const decoded = await jwt.verify(token, jwtToken)

        if(!decoded) return next(new AppError("session Expired", 401));

        //verify token wheather user exist or not
        let userData = await User.findById(decoded.id);        
        if(userData == null) return next(new AppError("user unauthenticated", 401));
        req.user = userData;
        next();

    } catch (err) {
        if (err.message === "jwt expired")   return next(new AppError("session Expired", 401));
        if (err.name === "TokenDestroyedError")   return next(new AppError('token Destroyed Error', 401));
        return next({ message: err.message });
    }
})






