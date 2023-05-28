const moment = require('moment');
// const fs = require('fs');
const UsernameGenerator = require('username-generator');
const User = require('..//models/user.model');
const Log = require('..//models/log.model');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const LoginHistory = require('../models/loginHistory.model')
const MasterField = require('../models/masterField.model')
const { AppError } = require('../utils/errorHandler');
const fs = require('fs')
let conversion = require("phantom-html-to-pdf")();
const appBaseUrl = process.env.APP_BASE_URL;




/**
 * Add New User
 * @param request body
 * @return json response
 */
exports.add = catchAsync(async (req, res, next) => {
    let body = { ...req.body };
    const userData = await User.findOne({ phone: body.phone });
    if (userData) return next(new AppError("user already exist", 400));

    const count = await User.findOne({}).countDocuments();
    body.username = `agm_${count}`;

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
exports.getAll = catchAsync(async (req, res, next) => {

    let filters = { deletedAt: null };
    const page = (req.query.page) ? parseInt(req.query.page) : 1;
    const limit = (req.query.limit) ? parseInt(req.query.limit) : 10;
    const skipIndex = (page - 1) * limit;

    if (req.query.name) filters.name = { $regex: req.query.name, $options: 'i' }

    // let taskArray = [ User.find(filters).sort({"_id":-1}).limit(limit).skip(skipIndex)];
    let taskArray = [User.find(filters).sort({ "_id": -1 })];
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
exports.getById = catchAsync(async (req, res, next) => {

    if (!req.params.id) return next(new AppError("user id is required.", 400));

    const profile = await User.findById(req.params.id);
    if (!profile) return next(new AppError("No profile found.", 400));

    return res.status(200).send({
        code: 200,
        message: "Get profile info.",
        data: profile
    });

});

/**
* upload images
* @param NA
* @return json response
*/
exports.imageUpload = catchAsync(async (req, res, next) => {
    
    let fileName = req.file.filename;    
    let fileUrl = `${appBaseUrl}/uploads/${fileName}`;
    return res.status(200).send({
        code: 200,
        message: "Image uploaded.",
        data: {
            fileName:req.file.filename,
            url: fileUrl
        }

    });

});


/**
 * Update User profile
 * @param req
 * @returns res
 */
exports.update = catchAsync(async (req, res, next) => {
    
    let { name, email, password, gender, dateOfBirth, gotra, education, occupation, interests, fatherName, motherName, address, phone, whatsapp, masterFields, city, pinCode, state, country,addressLine, budget, profile, profileDoc } = req.body;

    if (!req.params.id) return next(new AppError("user id is required.", 400));

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
        budget,
        fatherName,
        motherName,
        address,
        phone,
        whatsapp,
        city,
        pinCode,
        state,
        country,
        addressLine,
        profile,
        profileDoc,
        masterFields,
    };

    if (!req.params.id) return next(new AppError("user id is required.", 400));
    const profileDate = await User.findByIdAndUpdate({ '_id': req.params.id }, updateBody);

    if (!profileDate) return next(new AppError("User not found", 400));
    return res.status(200).send({
        code: 200,
        message: "profile updated successfully.",
        data: profileDate
    });
})


/**
 * Soft Delete Profile
 * @param req
 * @returns res
 */
exports.delete = catchAsync(async (req, res, next) => {

    if (!req.params.id) return next(new AppError("user id is required.", 400));
    const profile = await User.findByIdAndUpdate({ '_id': req.params.id }, { deletedAt: moment().valueOf() });

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
exports.getAllProfile = catchAsync(async (req, res, next) => {
    let filterLog = req.query;

    let filters = {deletedAt:null};
    if (req.query.gender) filters.gender = req.query.gender;
    if (req.query.gotra) filters.gotra = { $regex: req.query.gotra, $options: 'i' }
    if (req.query.budget) filters.budget = req.query.budget;
    if (req.query.occupation) filters.occupation = req.query.occupation;
    if (req.query.height) filters.height = req.query.height;
    if (req.query.isManglik) filters.isManglik = req.query.isManglik;
    
    if (req.query.age) {
        let age = Number(req.query.age)+1;
        let startDate = moment().subtract(req.query.age, 'years').calendar();
        let endDate = moment().subtract(age, 'years').calendar();
        filters.dateOfBirth = { $lt: startDate, $gt: endDate }
    }
    if (req.query.interests) {
        let interests = req.query.interests;
        filters.interests = { $in: interests }
    }
    
    let profiles = await User.find(filters).sort({ "_id": -1 });
    let profileData = profiles.map((item) => {        
        let { name, email, password, gender, dateOfBirth, gotra, education, occupation, interests, fatherName, motherName, address, phone, whatsapp, masterFields, city, pinCode, state, country,addressLine, budget, profile, profileDoc } = item;
        let newObj = {}
        newObj._id = item._id;
        newObj.name = name;
        newObj.email = email;
        newObj.gender = gender;
        newObj.gotra = gotra;
        newObj.education = education;
        newObj.occupation = occupation;
        newObj.interests = interests;
        newObj.fatherName = fatherName;
        newObj.motherName = motherName;
        newObj.address = address;
        newObj.city = city;
        newObj.phone = phone;
        newObj.whatsapp = whatsapp;
        newObj.pinCode = pinCode;
        newObj.state = state;
        newObj.country = country;
        newObj.addressLine = addressLine;
        newObj.profile = profile;
        newObj.profileDoc = profileDoc;
        newObj.masterFields = masterFields;
        newObj.budget = `${budget}`;
        newObj.dateOfBirth =item.dateOfBirt;
        newObj.dob = moment(item.dateOfBirth).format('DD MMM YYYY hh:mm A');
        return  newObj;
    })

    res.status(200).send({
        code: 200,
        message: "Get all profile successfully.",
        data: profileData,
        total: profileData.length
    }); 
    if(filterLog.length){
        let logData = {
            adminId: req.user._id,
            title: "profileSearch",
            description: "profileSearch",
            logData: JSON.stringify(filterLog),

        }
        await Log.create(logData);
    }

});


/**
 * Get Previews Serach Logs 
 * @param NA
 * @return json response
 */
exports.getProfileSearchLogs = catchAsync(async (req, res, next) => {

    let filters = {
        adminId: req.user._id,
        title: "profileSearch",
    };
    let logs = await Log.find(filters).sort({ "_id": -1 });   

    return res.status(200).send({
        code: 200,
        message: "Get profile Search logs successfully.",
        data: logs,
        total: logs.length
    }); 

});


/**
 * Admin report 
 * @param NA
 * @return json response
 */
exports.report = catchAsync(async (req, res, next) => {

    let malefilters = { gender: "male", deletedAt:null };
    let femalefilters = { gender: "female", deletedAt:null };
    let totalsharedCount = 0;
    let pipleline = [{
        $group: {
            _id: "null",
            totalsharedCount: { $sum: "$sharedCount" }
        }
    }]

    let taskArray = [
        User.find(malefilters).countDocuments(),
        User.find(femalefilters).countDocuments(),
        User.find({deletedAt:null}).countDocuments(),
        User.aggregate(pipleline)
    ];

    let [maleCount = 0, femaleCount = 0, totalUsers = 0, totalShared] = await Promise.all(taskArray);
    if (totalShared.length) totalsharedCount = totalShared[0].totalsharedCount;
    let data = {
        maleCount,
        femaleCount,
        totalUsers,
        totalsharedCount,

    }

    return res.status(200).send({
        code: 200,
        message: "Get report successfully.",
        data: data
    });

});


exports.getLoginHistory = catchAsync(async (req, res, next) => {

    let filters = { deletedAt: null };
    const page = (req.query.page) ? parseInt(req.query.page) : 1;
    const limit = (req.query.limit) ? parseInt(req.query.limit) : 10;
    const skipIndex = (page - 1) * limit;

    if (req.query.name) filters.name = { $regex: req.query.name, $options: 'i' }

    let taskArray = [LoginHistory.find(filters).sort({ "_id": -1 }).populate('adminId')];
    taskArray.push(LoginHistory.find(filters).count())

    let [profile, total = null] = await Promise.all(taskArray);

    return res.status(200).send({
        code: 200,
        message: "Get all login History successfully.",
        data: profile,
        total: total
    });

});





exports.profilePdfGenerate = catchAsync(async (req, res, next) => {
    
    if (!req.params.id) return next(new AppError("user id is required.", 400));
    let userIds = req.params.id.split(',')
    
    let profiles = await User.find({_id:{$in:userIds}});
    if (profiles.length < 1) return next(new AppError("No profile found.", 400));
    
    const maskingData = await MasterField.find({deletedAt:null,masking:true}).select('name -_id');

    profiles.map((profile) =>{
        maskingData.map((masking)=> {
            profile[masking.name] = "**************";
        })
        profile.interests = profile.interests.toString();
    });

    let html = await createPdfHTML(profiles);

    conversion({ html: html }, function(err, pdf) {
        let fileName = `profile_${moment().valueOf()}.pdf`;            
        let output = fs.createWriteStream(`./src/public/pdf/${fileName}`);
        pdf.stream.pipe(output);
        
        let pdfUrl = `${appBaseUrl}/pdf/${fileName}`

        res.status(200).send({
            code: 200,
            message: "PDF generated successfully.",
            data: {
                pdfUrl:pdfUrl
            }
        });

        let logData = {
            adminId: req.user._id,
            title: "pdfGenerated",
            description: "pdfUrl",
            logData: pdfUrl
        }
        Log.create(logData);

    });
    

});

function createPdfHTML(profileData){
    let profileTable ='';
    profileData.map((data)=>{
        profileTable= `${profileTable}
            <hr></hr>
            <table style="width:100%">
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td>:</td>
                        <td>${data.name|| ""}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>:</td>
                        <td>${data.email|| ""}</td>
                    </tr>
                    <tr>
                        <td>Gender</td>
                        <td>:</td>
                        <td>${data.gender || ""}</td>
                    </tr>
                    <tr>
                        <td>Date Of Birth</td>
                        <td>:</td>
                        <td>${data.dateOfBirth || ""}</td>
                    </tr>            
                    <tr>
                        <td>Gotra</td>
                        <td>:</td>
                        <td>${data.gotra || ""}</td>
                    </tr>            
                    <tr>
                        <td>Education</td>
                        <td>:</td>
                        <td>${data.education || ""}</td>
                    </tr>             
                    <tr>
                        <td>Occupation</td>
                        <td>:</td>
                        <td>${data.occupation || ""}</td>
                    </tr>                    
                    <tr>
                        <td>Budget</td>
                        <td>:</td>
                        <td>${data.budget || ""}</td>
                    </tr>     
                        
                    <tr>
                        <td>Interests</td>
                        <td>:</td>
                        <td>${data.interests || ""}</td>
                    </tr>            
                    <tr>
                        <td>Father Name</td>
                        <td>:</td>
                        <td>${data.fatherName || ""}</td>
                    </tr>            
                    <tr>
                        <td>Mother Name</td>
                        <td>:</td>
                        <td>${data.motherName || ""}</td>
                    </tr>           
                    <tr>
                        <td>Address</td>
                        <td>:</td>
                        <td>${data.address || ""}</td>
                    </tr>            
                    <tr>
                        <td>Phone</td>
                        <td>:</td>
                        <td>${data.phone || ""}</td>
                    </tr>
                </tbody>
            </table>`;
    })

    return `
    <html>
    <style></style>
    <body>
        <h2 style="text-align: center;">Profile informations</h2>
       ${profileTable}            
    </body>
</html>`;

}