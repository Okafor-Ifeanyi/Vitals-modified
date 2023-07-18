const joi = require('joi')

// Joi Validation schema used to verify req data
const createSchema = joi.object()
    .keys({
        patientID: joi.string(),
        name: joi.string(),
        phoneNO: joi.string(),
    });

module.exports = { createSchema };
