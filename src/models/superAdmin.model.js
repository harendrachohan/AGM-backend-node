const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtPrivateKey = process.env.JWT_TOKEN_KEY;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

const superAdminSchema = new Schema({
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
    createdAt: {
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


superAdminSchema.pre('save', async function (next) {
    if (this.password) this.password = await bcrypt.hash(this.password, 12)
    next()
})

superAdminSchema.methods.passwordCompare = async function (password) {
    return await bcrypt.compare(password, this.password)
}

superAdminSchema.methods.generateSignedToken = function () {
    const payload = { id: this._id };
    return jwt.sign(payload, jwtPrivateKey);
}
const superAdmin = mongoose.model('superAdmins', superAdminSchema);
module.exports = superAdmin;