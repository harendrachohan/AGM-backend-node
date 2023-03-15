const SuperAdmin = require('../models/superAdmin.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * Super admin login
 * @param email, password
 * @returns json response
 */
exports.superAdminLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('login credentials are missing.', 400));

    let user = await SuperAdmin.findOne( {'email':email}).select('+password')
    
    if (!user) return next(new AppError("User not found.", 400));
    if(!user.password) return next(new AppError("invalid Credentials.", 400));

    const passwordCheck = await user.passwordCompare(password);
    if(!passwordCheck) return next(new AppError("invalid Credentials.", 400))

    const token = await user.generateSignedToken();
    user.password = null;

    return res.status(200).send({
        code: 200,
        message: "Login successfully.",
        accessToken: token,
        data: user,
    });
        
});




exports.login = catchAsync(async (req, res, next) => {
    return res.status(200).send({
        code: 200,
        message: "Get successfully.",
    });
        
});
