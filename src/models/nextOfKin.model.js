const mongoose = require('mongoose');
const Schema = mongoose.Schema

const nextOfKinSchema = new Schema({
    patientID: {
        type: Schema.Types.ObjectId,
        ref: 'HCPModel',
        required: true,
    },
    name: {
        type: String, 
        required: true, trim: true
    },
    phoneNumber: {
        type: String, 
        required: true, 
        max: 11
    },
    relationship: {
        type: String, 
        required: true, 
        trim: true
    },
    
}, { timestamps: true });

const nextOfKinModel = mongoose.model("NextOfKin", nextOfKinSchema)

module.exports = nextOfKinModel