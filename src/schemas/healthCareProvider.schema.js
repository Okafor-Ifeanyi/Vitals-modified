const joi = require('joi')

// Joi Validation schema used to verify req data
const RegisterSchema = joi.object()
    .keys({
        name: joi.string().required(),
        password: joi.string().min(6).required(),
        // email: joi.string().required(),
        confirm_password: joi.any().equal(joi.ref('password'))
                                .required()
                                .label('Confirm password')
                                .messages({ 'any.only': '{{#label}} does not match' }),
        address: joi.string().required(),
        registrationNo: joi.string().required()
    });

const LoginSchema = joi.object()
.keys({
    registrationNo: joi.string().required(),
    password: joi.string().min(6).required()
});

const UpdateSchema = joi.object()
.keys({
    name: joi.string(),
    address: joi.string(),
});

module.exports = { RegisterSchema, LoginSchema, UpdateSchema };
