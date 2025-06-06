const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        verifyOtp: {
            type: String,
            default: ''
        },
        verifyOtpExpiresAt: {
            type: Number,
            default: 0
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        resetOtp: {
            type: String,
            default: ''
        },
        resetOtpExpiresAt:{
            type: Number,
            default: 0
        }
    }
)

const User = mongoose.model('user', UserSchema)
module.exports = User