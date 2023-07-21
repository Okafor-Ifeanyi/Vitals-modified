const joi = require('joi');

// Joi Validation schema used to verify req data
const RegisterSchema = joi.object()
    .keys({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().required().email(),
        password: joi.string().min(6).required(),
        confirm_password: joi.any().equal(joi.ref('password'))
            .required()
            .label('Confirm password')
            .messages({ 'any.only': '{{#label}} does not match' }),
        licenseNO: joi.string().min(6).required(),
        specialty: joi.string().required()
    });

const LoginSchema = joi.object()
    .keys({
        email: joi.string().required().email(),
        password: joi.string().min(6).required(),
        // healthCareProviderID: joi.string().required()
    });

const UpdateSchema = joi.object()
    .keys({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        // email: joi.string().required().email(),
    });

const hcpRefSchema = joi.object()
    .keys({
        HCP_id: joi.string().required(),
    });


const forgotPasswordSchema = joi.object()
    .keys({
        email: joi.string().required().email()
    });

const resetPasswordSchema = joi.object()
    .keys({
        newPassword: joi.string().min(6).required(),
        resetLink: joi.string().required(),
    });

module.exports = { RegisterSchema, LoginSchema, UpdateSchema, hcpRefSchema, forgotPasswordSchema, resetPasswordSchema };