const { response } = require('express')
const jwt = require('jsonwebtoken')

module.exports = {
    async userAuth(req, res, next) {
        const { token } = req.cookies

        if (!token) {
            return res.status(401).json({ response_message: 'Unauthorized' })
        }

        try {
            const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
            if (tokenDecode.id) {
                req.body = req.body || {}
                req.body.userId = tokenDecode.id
                next()
            } else {
                return res.status(401).json({ response_message: 'Unauthorized' })
            }


        } catch (error) {
            console.log(error)
            return res.json(500).json(error)
        }

    }
}