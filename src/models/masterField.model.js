const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const masterFieldsSchema = new Schema({
    name: {
        type: String,
    },
    type: {
        type: String,
    },    
    required: {
        type: Boolean,
    },    
    masking: {
        type: Boolean,
    },
    createdAt: {
        type: Number,
    },
    updatedAt: {
        type: Number,
    },
    deletedAt: {
        type: Number,
    }
},
{ 
    timestamps: true,
    versionKey: false 
});

const MasterField = mongoose.model('master-fields', masterFieldsSchema);
module.exports = MasterField;