const moment = require('moment');
const UsernameGenerator = require('username-generator');
const User = require('..//models/user.model');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const { AppError } = require('../utils/errorHandler');



/**
 * Add New User
 * @param request body
 * @return json response
 */
exports.add = catchAsync(async(req, res, next) => {
    let body = { ...req.body};
    const userData = await User.findOne({ phone: body.phone});
    if(userData) return next(new AppError("user already exist", 400));

    body.username = await UsernameGenerator.generateUsername("-");

    const profile = await User.create(body);

    return res.status(201).send({ 
            code: 201,
            message: "Profile added successfully.",
            data: profile
        });
});

/**
 * Get all Profile
 * @param NA
 * @return json response
 */ 
 exports.getAll = catchAsync(async(req, res, next) => {

    let filters = {};
    const page =(req.query.page) ? parseInt(req.query.page): 1;
    const limit = (req.query.limit)? parseInt(req.query.limit):10;
    const skipIndex = (page - 1) * limit;

    if(req.query.name) filters.name = {$regex: req.query.name, $options:'i'}

    let taskArray = [ User.find(filters).sort({"_id":-1}).limit(limit).skip(skipIndex)];
        taskArray.push(User.find(filters).count())

    let [profile, total = null] = await Promise.all(taskArray);

    return res.status(200).send({
        code: 200, 
        message: "Get all profile successfully.",
        data: profile,
        total: total
    });

});

/**
* Get Profile Details
* @param NA
* @return json response
*/ 
exports.getById = catchAsync(async(req, res, next) => {

    if(!req.params.id) return next(new AppError("user id is required.", 400));

    const profile = await User.findById(req.params.id);       
    if(!profile) return next(new AppError("No profile found.", 400));

    return res.status(200).send({ 
        code: 200,
        message: "Get profile info.",
        data: profile
    });

});

/**
 * Update User profile
 * @param req
 * @returns res
 */
 exports.update = catchAsync(async (req, res, next) => {

    
    let {name, email, password, gender, dateOfBirth, gotra, education, occupation, interests,fatherName,motherName,address,phone, whatsapp, masterFields} = req.body;

    if(!req.params.id) return next(new AppError("user id is required.", 400));

    let updateBody = {
        name,
        email,
        password,
        gender,
        dateOfBirth,
        gotra,
        education,
        occupation,
        interests,
        fatherName,
        motherName,
        address,
        phone,
        whatsapp,
        masterFields
    };

    if(!req.params.id) return next(new AppError("user id is required.", 400));
    const profile = await User.findByIdAndUpdate({ '_id': req.params.id }, updateBody);

    if (!profile) return next(new AppError("User not found", 400));    
    return res.status(200).send({
        code: 200,
        message: "profile updated successfully.",
        data: profile
    });
})


/**
 * Soft Delete Profile
 * @param req
 * @returns res
 */
exports.delete = catchAsync(async (req, res, next) => {

    if(!req.params.id) return next(new AppError("user id is required.", 400));
    const profile = await User.findByIdAndUpdate({ '_id': req.params.id }, {deletedAt:moment().valueOf()});

    if (!profile) return next(new AppError("User not found", 400));    
    return res.status(200).send({
        code: 200,
        message: "profile delete successfully.",
        data: profile
    });
})



/**
 * Get all Profile 
 * @param NA
 * @return json response
 */ 
exports.getAllProfile = catchAsync(async(req, res, next) => {

    let filters = {};
    const page =(req.query.page) ? parseInt(req.query.page): 1;
    const limit = (req.query.limit)? parseInt(req.query.limit):10;
    const skipIndex = (page - 1) * limit;

    if(req.query.name) filters.name = {$regex: req.query.name, $options:'i'}
    if(req.query.name) filters.name = {$regex: req.query.name, $options:'i'}

    let taskArray = [ User.find(filters).sort({"_id":-1}).limit(limit).skip(skipIndex)];
        taskArray.push(User.find(filters).count())

    let [profile, total = null] = await Promise.all(taskArray);

    return res.status(200).send({
        code: 200, 
        message: "Get all profile successfully.",
        data: profile,
        total: total
    });

});

