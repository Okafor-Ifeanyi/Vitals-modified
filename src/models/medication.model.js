const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    drugName: {
        type: String,
        required: true
    },
    prescription: {
        type: String,
        required: true
    }
}, { timestamps: true })

const medicationModel = mongoose.model("Medication", medicationSchema);
module.exports = medicationModel
