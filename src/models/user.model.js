const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtPrivateKey = process.env.JWT_TOKEN_KEY;


const masterFieldsSchema = {
    name: {
        type: String,
    },
    value: {
        type: String,
    },
    masterFieldId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'masterFields',
    },
    type: {
        type: String,
        select:false,
    },    
    required: {
        type: Boolean,
        select:false,
    },    
    masking: {
        type: Boolean,
        select:false,
    }
};

const usersSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    name: { 
        type: String,
        required: true,
    },
    email: { 
        type: String,
        default: null,
        trim: true,            
        required: true,
    },
    password: { 
        type: String,
        trim: true,    
    },
    gender: { 
        type: String,
        enum: ['male','female','other','null'],
        default: null,
    },        
    profile: {
        fileName: {
            type: String, 
            default: 'default-user.png'
        },
        url: { type: String },
    },            
    profileDoc: {
        fileName: {
            type: String, 
            default: 'default-user.png'
        },
        url: { type: String },
    },
    dateOfBirth: {
        type: Date,
        trim: true,
    },    
    gotra:{
        type:String,
        required:true,
    },        
    education:{
        type:String,
    },
    occupation:{
        type:String,
        required:true,
    },
    interests: {
        type: Array,
    },
    fatherName: { 
        type: String,
        select: false
    },
    motherName: { 
        type: String,
        select: false
    },
    address: { 
        type: String,
        select: false
    },
    phone: { 
        type: String,
        select: false
    },
    whatsapp: { 
        type: String,
        select: false
    },
    sharedCount: { 
        type: Number,
        select: false
    },
    budget: {
        type: String,
    },
    masterFields: {
        type: [masterFieldsSchema]
    },
    createdAt: {
        type: Number,
    },
    lastLogin: {
        type: Number,
    },
    updatedAt: {
        type: Number,
    },
    deletedAt: {
        type: Number,
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
{ 
    timestamps: true,
    versionKey: false 
});


usersSchema.pre('save', async function (next) {
    if (this.password) this.password = await bcrypt.hash(this.password, 12)
    next()
})

usersSchema.methods.passwordCompare = async function (password) {
    return await bcrypt.compare(password, this.password)
}

usersSchema.methods.generateSignedToken = function () {
    const payload = { id: this._id };
    return jwt.sign(payload, jwtPrivateKey);
}
const User = mongoose.model('users', usersSchema);
module.exports = User;