const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const profileShareSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        select: false
    },
    sharedWith: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        select: false
    },        
    createdAt: {
        type: Number,
    }
},
{ 
    timestamps: true,
    versionKey: false 
});
const ProfileShared = mongoose.model('profile-shared', profileShareSchema);
module.exports = ProfileShared;