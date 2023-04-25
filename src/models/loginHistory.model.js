const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const loginHistorySchema = new Schema({
    ip: { 
        type: String, 
    },
    origin: { 
        type: String, 
    },
    description: { 
        type: String, 
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins",
    },   
    userType: {        
        type: Number,  
        enum: [1,2,3]
    }, 
    logData: { 
        type: String,
        default: null,
    },        
    createdAt: {
        type: Number,
    }
},
{ 
    timestamps: true,
    versionKey: false 
});
const LoginHistory = mongoose.model('login-histories', loginHistorySchema);
module.exports = LoginHistory;