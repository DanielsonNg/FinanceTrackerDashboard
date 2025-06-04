const { AuthSchema } = require("../middlewares/validation_body")
const User = require("../models/user.model")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { transporter } = require("../config/nodemailer")

module.exports = {
    async register(req, res) {
        try {
            const data = req.body || {}
            const { error } = AuthSchema.register.validate(data)
            const valid = error == null
            if (!valid) {
                return res.status(422).json({
                    response_message: error.message
                })
            }

            const existUser = await User.findOne({ email: data.email })

            if (existUser) {
                return res.status(409).json({ msg: 'Email Already Registered' })
            }

            const hashedPass = await bcrypt.hash(data.password, 10)

            const createUser = await User.create({
                name: data.name, email: data.email, password: hashedPass
            })

            const token = jwt.sign({ id: createUser._id },
                process.env.JWT_SECRET, { expiresIn: '7d' })

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: data.email,
                subject: 'Welcome',
                text: `Your Account Has Been Created ${data.email}`
            }
            await transporter.sendMail(mailOptions)

            return res.status(200).json({ msg: 'Register Success' })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    },

    async login(req, res) {
        try {
            const data = req.body || {}
            const { error } = AuthSchema.login.validate(data)
            const valid = error == null
            if (!valid) {
                return res.status(422).json({
                    response_message: error.message
                })
            }

            const userFind = await User.findOne({ email: data.email })

            if (!userFind) {
                return res.status(401).json({ response_message: 'Email or Password Invalid' })

            }

            const passMatch = await bcrypt.compare(data.password, userFind.password)
            if (!passMatch) {
                return res.status(401).json({ response_message: 'Email or Password Invalid' })
            }
            const token = jwt.sign({ id: userFind._id },
                process.env.JWT_SECRET, { expiresIn: '7d' })

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            return res.status(200).json({ msg: 'Login Success' })


        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    },

    async logout(req, res) {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            })

            return res.status(200).json({ msg: 'Logout Success' })
        } catch (error) {
            console.log(error)
        }
    },

    async sendVerifyOTP(req, res) {
        try {
            const { userId } = req.body

            const user = await User.findById(userId)
            if (!user) {
                return res.status(404).json({
                    response_message: 'User Not Found'
                })
            }
            if (user.isVerified) {
                return res.status(409).json({
                    response_message: 'User is Already Verified'
                })
            }

            const otp = String(Math.floor(100000 + Math.random() * 900000))
            user.verifyOtp = otp
            user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000
            await user.save()

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: 'Account Verification OTP',
                text: `Your OTP is ${otp}, Use this to verify your account`
            }

            await transporter.sendMail(mailOptions)

            return res.status(200).json({ response_message: 'Verification OTP Sent on Email' })

        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    },

    async verifyEmail(req, res) {
        try {
            const data = req.body || {}
            const { error } = AuthSchema.verifyEmail.validate(data)
            const valid = error == null
            if (!valid) {
                return res.status(422).json({
                    response_message: error.message
                })
            }

            const userFind = await User.findById(data.userId)

            if (!userFind) {
                return res.status(404).json({
                    response_message: 'User Not Found'
                })
            }
            if (userFind.verifyOtp === '' || userFind.verifyOtp !== data.otp) {
                return res.status(401).json({ response_message: 'Invalid OTP' })
            }

            if (userFind.verifyOtpExpiresAt < Date.now()) {
                return res.status(498).json({ response_message: 'OTP Expired' })
            }

            userFind.isVerified = true

            userFind.verifyOtp = ''
            userFind.verifyOtpExpiresAt = 0

            await userFind.save()
            return res.status(200).json({ response_message: 'Email Verified Successfully' })

        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    },

    async isAuthenticated(req, res) {
        try {
            return res.status(200).json({ success: true })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    },

    async sendResetOtp(req, res) {
        try {

            const { email } = req.body || {}
            if (!email) {
                return res.status(422).json({ response_message: 'Unprocessable Entity' })
            }

            const userFind = await User.findOne({ email: email })
            if (!userFind) {
                return res.status(404).json({ response_message: "User Not Found" })
            }
            const otp = String(Math.floor(100000 + Math.random() * 900000))
            userFind.resetOtp = otp
            userFind.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000

            await userFind.save()

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: userFind.email,
                subject: 'Reset Password OTP',
                text: `Your OTP is ${otp}, Use this to reset your password`
            }

            await transporter.sendMail(mailOptions)

            return res.status(200).json({ response_message: "OTP has been Sent to Your Email" })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    },

    async resetPassword(req, res) {
        try {
            const { email, otp, newPass } = req.body
            if (!email || !otp || !newPass) {
                return res.status(422).json({ response_message: "Invalid Input Data" })
            }
            const userFind = await User.findOne({ email: email })

            if (!userFind) {
                return res.status(404).json({ response_message: "User Not Found" })
            }
            console.log(otp)
            console.log(userFind.resetOtp)
            if (userFind.resetOtp === "" || userFind.resetOtp !== otp) {
                return res.status(401).json({ response_message: 'Invalid OTP' })
            }

            if (userFind.resetOtpExpiresAt < Date.now()) {
                return res.status(498).json({ response_message: 'OTP Expired' })
            }

            const hashedPass = await bcrypt.hash(newPass, 10)

            userFind.password = hashedPass
            userFind.resetOtp = ''
            userFind.resetOtpExpiresAt = 0

            await userFind.save()

            return res.status(200).json({response_message:"Password Reset Successfully"})

        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
}