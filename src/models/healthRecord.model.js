const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const healthRecordSchema = new Schema({
    patient_id: {
        type: Schema.Types.ObjectId, ref: "patientModel", required: true
    },
    HCP_id: {
        type: Schema.Types.ObjectId, ref: "providerModel", required: true
    },
    doctor_id: {
        type: Schema.Types.ObjectId, ref: "doctorModel", required: true
    },
    // scheduleDate: {
    //     type: Date,
    // },
    approvalState: {
        type: Boolean, default: false
    },
    status: {
        type: String,
        enum : ['Pending','Attended', "Cancelled", "Missed"], 
        default: 'Pending'
    },
    data: {
        type: String, trim: true
    },
    disease: {
        type: String, trim: true
    },
    diseaseDetail: {
        type: String, trim: true
    },
    signsAndSymptoms: {
        type: String, trim: true
    },
    labTest: {
        type: String, trim: true
    },
    labResult: {
        type: String, trim: true
    },
    bloodPressure: {
        type: String,
    },
    heartRate: {
        type: String,
    },
    respiratoryRate: {
        type: String,
    },
    bloodSugar: {
        type: String,
    },
    temperature: {
        type: String,
    },
    oxygenLevel: {
        type: String,
    },
    medicationName: {
        type: String,
    },
    dosage: {
        type: String,
    },
    deleted: {
        type: Boolean, required: true, default: false
    }
}, { timestamps: true })

const healthRecordModel = mongoose.model("HealthRecord", healthRecordSchema);
module.exports = healthRecordModel
