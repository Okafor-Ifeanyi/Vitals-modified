const joi = require("joi");

// Joi Validation schema used to verify req data
const RegisterSchema = joi.object().keys({
  firstName: joi.string().required(),
  middleName: joi.string(),
  lastName: joi.string().required(),
  email: joi.string().required().email(),
  password: joi.string().min(6).required(),
  confirm_password: joi
    .any()
    .equal(joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "Confirm Password does not match the password" }),
  phoneNumber: joi.string().required()
  // address: joi.string().required(),
});

const LoginSchema = joi.object().keys({
  email: joi.string().required().email(),
  password: joi.string().min(6).required()
});

const UpdateSchema = joi.object().keys({
  firstName: joi.string(),
  middleName: joi.string(),
  lastName: joi.string(),
  phoneNumber: joi.string(),
  address: joi.string(),
  bio: joi.string(),
  height: joi.string(),
  weight: joi.string(),
  blood_group: joi.string(),
  genotype: joi.string(), 
  profile_img: joi.string(), 
});

const forgotPasswordSchema = joi.object().keys({
  email: joi.string().required().email()
});

const verifyCode = joi.object().keys({
  code: joi.number().required().max(6).min(6)
});

const resetPasswordSchema = joi.object().keys({
  newPassword: joi.string().required(),
  resetLink: joi.string().required()
});

module.exports = {
  RegisterSchema,
  LoginSchema,
  UpdateSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyCode
};
