const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const logsSchema = new Schema({      
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        select: false
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins",
        select: false
    },
    title: { 
        type: String, 
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
const Log = mongoose.model('logs', logsSchema);
module.exports = Log;