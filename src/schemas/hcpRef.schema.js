const joi = require('joi')

// Joi Validation schema used to verify req data
const hcpRefSchema = joi.object()
    .keys({
        HCP_id: joi.string().required(),
    });

module.exports = { hcpRefSchema };