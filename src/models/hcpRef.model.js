const mongoose = require('mongoose');
const Schema = mongoose.Schema

const hcpRefSchema = new Schema({
    HCP_id: {
        type: Schema.Types.ObjectId,
        ref: 'HCPModel',
        required: true,
    },
    doctorID: {
        type: Schema.Types.ObjectId,
        ref: 'doctorModel',
        required: true,
    },
    approvalState: {
        type: Boolean, 
        default: false,
    },
    awaiting: {
        type: String,
        enum : ['Doctor','Hospital', "Answered"], 
        default: 'Hospital'
    }
}, { timestamps: true });

const hcpRefModel = mongoose.model("HcpRef", hcpRefSchema)

module.exports = hcpRefModel