const moment = require('moment');
const Admin = require('../models/admin.model');
const User = require('../models/user.model');
const LoginHistory = require('../models/loginHistory.model')
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

const {AppError } = require('../utils/errorHandler')

/**
 * Super admin and admin login
 * @param email, password
 * @returns json response
 */
exports.adminLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('login credentials are missing.', 400));

    let user = await Admin.findOne( {'email':email}).select('+password')
    
    if (!user) return next(new AppError("User not found.", 400));
    if(!user.password) return next(new AppError("invalid Credentials.", 400));

    const passwordCheck = await user.passwordCompare(password);
    if(!passwordCheck) return next(new AppError("invalid Credentials.", 400));
    
    let curentTimestamp = moment().utc();    
    let userData = await Admin.findOneAndUpdate({ _id: user.id}, { lastLogin: curentTimestamp });

    const token = await user.generateSignedToken();
    user.password = null;
    loginHistory(req, user, 1 );

    return res.status(200).send({
        code: 200,
        message: "Login successfully.",
        accessToken: token,
        data: user,
        user: req.get('origin')

    });
        
});


/**
 * User login
 * @param email, password
 * @returns json response
 */
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('login credentials are missing.', 400));

    let user = await User.findOne( {'email':email}).select('+password')
    
    if (!user) return next(new AppError("User not found.", 400));
    if(!user.password) return next(new AppError("invalid Credentials.", 400));

    const passwordCheck = await user.passwordCompare(password);
    if(!passwordCheck) return next(new AppError("invalid Credentials.", 400));
    
    let curentTimestamp = moment().utc();    
    let userData = await User.findOneAndUpdate({ _id: user.id}, { lastLogin: curentTimestamp });

    const token = await user.generateSignedToken();
    user.password = null;

    //login the user login history
    loginHistory(req, user, 2 );

    return res.status(200).send({
        code: 200,
        message: "Login successfully.",
        accessToken: token,
        data: user,
    });
        
});


const loginHistory = async(req, user, userType) => {
    
    let ip = req.socket.remoteAddress;
    // let ip = req.ip;
    let origin = req.headers.origin || "";
    let body ={
        userType,
        adminId : user._id,
        ip,
        origin
    } 
    return await LoginHistory.create(body);
        
};


