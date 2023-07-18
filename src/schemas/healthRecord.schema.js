const joi = require('joi')

// Joi Validation schema used to verify req data
const createSchema = joi.object()
    .keys({
        patient_id: joi.string().required(),
        // scheduleDate: joi.date().required()
    });

const approveSchema = joi.object()
    .keys({
        healthRecordID: joi.string().required()
});
module.exports = { createSchema, approveSchema };