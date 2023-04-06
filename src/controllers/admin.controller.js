const moment = require('moment');
const UsernameGenerator = require('username-generator');
const Admin = require('../models/admin.model');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/errorHandler')


/**
 * Add New Admin
 * @param request body
 * @return json response
 */
exports.add = catchAsync(async(req, res, next) => {
    let {name, email, password, modules, permission} = req.body;

    const userData = await Admin.findOne({ username: username});
    if(userData) return next(new AppError("username already exist", 400));
    
    
    let body = {
        name,
        email,
        password,
        modules,
        permission
    }
    body.username = await UsernameGenerator.generateUsername("-");

    const admin = await Admin.create(body);

    return res.status(201).send({ 
            code: 201,
            message: "Admin added successfully.",
            data: admin
        });
});

/**
 * Get all Admin
 * @param NA
 * @return json response
 */ 
 exports.getAll = catchAsync(async(req, res, next) => {

    let filters = {deletedAt:null};
    const page =(req.query.page) ? parseInt(req.query.page): 1;
    const limit = (req.query.limit)? parseInt(req.query.limit):10;
    const skipIndex = (page - 1) * limit;

    if(req.query.name) filters.name = {$regex: req.query.name, $options:'i'}

    let taskArray = [ Admin.find(filters).sort({"_id":-1}).limit(limit).skip(skipIndex)];
        taskArray.push(Admin.find(filters).count())

    let [profile, total = null] = await Promise.all(taskArray);

    return res.status(200).send({
        code: 200, 
        message: "Get all admin successfully.",
        data: profile,
        total: total
    });

});

/**
* Get Admin Details
* @param NA
* @return json response
*/ 
exports.getById = catchAsync(async(req, res, next) => {

    if(!req.params.id) return next(new AppError("user id is required.", 400));
    const admin = await Admin.findById(req.params.id);

    return res.status(200).send({ 
        code: 200,
        message: "Get admin info.",
        data: admin
    });

});

/**
 * Update Admin
 * @param req
 * @returns res
 */
 exports.update = catchAsync(async (req, res, next) => {

    let {name, email, password, modules, permission} = req.body;
    if(!req.params.id) return next(new AppError("user id is required.", 400));   
    
    let updateBody = {
        name,
        email,
        password,
        modules,
        permission
    }

    const profile = await Admin.findByIdAndUpdate({ '_id': req.params.id }, updateBody);
    if (!profile) return next(new AppError("User not found", 400));    
    return res.status(200).send({
        code: 200,
        message: "admin updated successfully.",
        data: profile
    });
})


/**
 * Soft Delete admin
 * @param req
 * @returns res
 */
exports.delete = catchAsync(async (req, res, next) => {

    if(!req.params.id) return next(new AppError("user id is required.", 400));
    const admin = await Admin.findByIdAndUpdate({ '_id': req.params.id }, {deletedAt:moment().valueOf()});

    if (!admin) return next(new AppError("User not found", 400));    
    return res.status(200).send({
        code: 200,
        message: "Admin delete successfully.",
        data: admin
    });
})


