const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
    bloodPressure: {
        type: String,
    },
    heartRate: {
        type: String,
    },
    RespiratoryRate: {
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
    patientID: {
        type: String,
        required: true,
        ref: 'patientModel'
    },
    doctorsID: {
        type: String,
        required: true,
        ref: 'doctorModel'
    }

}, { timestamps: true });

const vitalsModel = mongoose.model("Vitals", vitalsSchema)

module.exports = vitalsModel