const Joi = require('joi')

const login = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const register = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const verifyEmail = Joi.object().keys({
    userId: Joi.string().required(),
    otp: Joi.string().required()
})

module.exports = {
    login,
    register,
    verifyEmail
}