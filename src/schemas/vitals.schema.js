const joi = require('joi')

// Joi Validation schema used to verify req data
const createSchema = joi.object()
    .keys({
        heartRate: joi.string(),
        bloodPressure: joi.string(),
        respiratoryRate: joi.string(),
        bloodSugar: joi.string(),
        temperature: joi.string(),
        oxygen: joi.string(),
        patientID: joi.string(),
    });

module.exports = { createSchema };
