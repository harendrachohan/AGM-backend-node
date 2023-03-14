const MasterField = require('..//models/masterField.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


/**
 * Add New Fields
 * @param request body
 * @return json response
 */
exports.create = catchAsync(async(req, res, next) => {

    let body = { ...req.body};
    const masterField = await MasterField.findOne({ name: req.body.name});
    if(masterField) return next(new AppError("Field already exit", 400));

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

    let filters = {};
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skipIndex = (page - 1) * limit;

    if(req.query.name) filters.name = {$regex: req.query.name, $options:'i'}

    let taskArray = [ MasterField.find(filters).sort({"_id":-1})];
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

    if(!req.params.id) return next(new AppError(global.messages.areaIdRequired, 400));

    let filters = { '_id': req.params.id, deletedAt: null};

    const field = await MasterField.findOne(filters);

    return res.status(200).send({ 
        code: 200,
        message: "Get master field detils.",
        data: field
    });

});

/**
 * Update Area Data
 * @param req
 * @returns res
 */
 exports.update = catchAsync(async (req, res, next) => {

    if(!req.params.id) return next(new AppError(global.messages.areaIdRequired, 400));
    const area = await findByIdAndUpdate(Area, { '_id': req.params.id }, { ...req.body });

    if (!area) return next(new AppError(global.messages.areaNotExits, 400))
    
    res.status(200).send({
        code: 200,
        message: global.messages.areaUpdated,
        data: area
    });
})

/**
 * Soft Delete Area 
 */
 exports.deleteArea = catchAsync(async (req, res, next) => {

    if(!req.params.id) return next(new AppError(global.messages.areaIdRequired, 400));

    await softDelete(Area, { '_id': req.params.id });

    res.status(200).json({
        code: 200,
        message: global.messages.areaDeleted,
    })
})


