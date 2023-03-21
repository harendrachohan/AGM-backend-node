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
    userId: {        
        type: String,
        select: false
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
const LoginHistory = mongoose.model('loginHistory', loginHistorySchema);
module.exports = LoginHistory;