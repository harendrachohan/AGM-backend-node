const jwt = require('jsonwebtoken');
const moment = require('moment');
const SuperAdmin = require('../models/superAdmin.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const env = require('dotenv').config();
const jwtToken = process.env.JWT_TOKEN_KEY;

/**
 * JWT Auth for all Users
 */
// exports.jwtMiddleware  = catchAsync(async (req, res, next) => {
//     try {
//         // check header or url parameters or post parameters for token      
//         let token
//         if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//             token = req.headers.authorization.split(' ')[1]
//         }

//         if(!token || token =='null') return next(new AppError( global.messages.noToken, 401));
//         // decode token    
//         const decoded =  await jwt.verify(token, jwtToken);

//         // verifies secret and checks exp        
//         if (!decoded) return next(new AppError( global.messages.sessionExpired, 401));

//         //verify token wheather user exist or not
//         let userData = await User.findById(decoded.id);

//         if (userData == null) return next(new AppError( global.messages.userAuthentication, 401));
        
//         //check if user Active or Not
//         if (!userData.isActive) return next(new AppError( global.messages.inactiveUser, 401));
        
//         //check if account is deleted by admin
//         if (userData.deletedAt) return next(new AppError( global.messages.accountDeletedByAdmin, 401));
//         // CHECK IN ACTIVE SESSION 
//         const activeSessions = userData.accessToken || null ;        
//         if(activeSessions){
//             if(!activeSessions.includes(token)){ return next(new AppError( global.messages.sessionExpired, 401));}
//         }
//         else {
//             return next(new AppError( global.messages.inactiveUser, 401)); 
//         }

//         userData.token = token;
//         delete userData.sessions;
//         delete userData.sessions;
//         req.user = userData;

//         next();
//     } catch (err) {
//         console.log(err);
//         if (err.message === "jwt expired")   return next(new AppError( global.messages.sessionExpired, 401));
//         if (err.name === "TokenDestroyedError")   return next(new AppError( global.messages.tokenDestroyedError, 401));
//         return next({ message: err });
//     }
// })



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

        let curentTimestamp = moment().utc().unix();
        //verify token wheather user exist or not
        let userData = await SuperAdmin.findOneAndUpdate({ _id: decoded.id }, { lastLogin: curentTimestamp });

        if(userData == null) return next(new AppError("user unauthenticated", 401));

        next();

    } catch (err) {
        if (err.message === "jwt expired")   return next(new AppError("session Expired", 401));
        if (err.name === "TokenDestroyedError")   return next(new AppError('token Destroyed Error', 401));
        return next({ message: err.message });
    }
})





