const express = require('express')
const { login, register, logout, sendVerifyOTP, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } = require('../controllers/auth')
const { userAuth } = require('../middlewares/validation_header')
const { getUserData } = require('../controllers/user')
const router = express.Router()


//Auth
router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)
router.post('/send-verify-otp', userAuth, sendVerifyOTP)
router.post('/verify-account', userAuth, verifyEmail)
router.post('/is-auth', userAuth, isAuthenticated)
router.post('/send-reset-otp', sendResetOtp)
router.post('/reset-password', resetPassword)

//User
router.get('/get-user-data',userAuth, getUserData)

module.exports = router