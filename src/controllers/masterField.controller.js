const MasterField = require('..//models/masterField.model');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

const {AppError } = require('../utils/errorHandler')


/**
 * Add New Fields
 * @param request body
 * @return json response
 */
exports.add = catchAsync(async(req, res, next) => {

    let body = { ...req.body};
    const masterField = await MasterField.findOne({ name: req.body.name});
    if(masterField) return next(new AppError("Field already exist", 400));

    const newField = await MasterField.create(body);

    return res.status(201).send({ 
            code: 201,
            message: "Field added successfully.",
            data: newField
        });
});

/**
 * Get all Master Field 
 * @param NA
 * @return json response
 */ 
 exports.getAll = catchAsync(async(req, res, next) => {

    let filters = {deletedAt:null};
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skipIndex = (page - 1) * limit;

    if(req.query.name) filters.name = {$regex: req.query.name, $options:'i'}

    let taskArray = [ MasterField.find(filters).sort({"preDefine":-1, "_id": -1 })];
        taskArray.push(MasterField.find(filters).count())

    let [masterFields, total = null] = await Promise.all(taskArray);

    return res.status(200).send({
        code: 200, 
        message: "Get all master Fields successfully.",
        data: masterFields,
        total:total
    });

});

/**
* Get  Details
* @param NA
* @return json response
*/ 
exports.getById = catchAsync(async(req, res, next) => {

    if(!req.params.id) return next(new AppError("Field id is required.", 400));

    let filters = { '_id': req.params.id, deletedAt: null};
    const field = await MasterField.findOne(filters);

    return res.status(200).send({ 
        code: 200,
        message: "Get master field details.",
        data: field
    });

});

/**
 * Update Master Data Fields
 * @param req
 * @returns res
 */
 exports.update = catchAsync(async (req, res, next) => {

    if(!req.params.id) return next(new AppError("Field id is required.", 400));
    const fieldData = await MasterField.findByIdAndUpdate({ '_id': req.params.id }, { ...req.body });

    if (!fieldData) return next(new AppError("Field not found", 400));    
    return res.status(200).send({
        code: 200,
        message: "Field update successfully.",
        data: fieldData
    });
})

/**
 * Soft Delete Field 
 */
 exports.delete = catchAsync(async (req, res, next) => {

    if(!req.params.id) return next(new AppError("Field id is required.", 400));

    await MasterField.deleteOne({ '_id': req.params.id });

    res.status(200).json({
        code: 200,
        message: "Field deleted successfully",
    })
})


