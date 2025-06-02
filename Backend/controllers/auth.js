const { LoginSchema } = require("../middlewares/validation_body")

module.exports = {
    async login(req, res) {
        try {
            const data = req.body || {}
            const { error } = LoginSchema.login.validate(data)
            const valid = error == null
            if (!valid) {
                return res.status(422).json({
                    response_message: error.message
                })
            }

            return res.status(200).json({ msg: 'Hello' })
        } catch (error) {
            console.error(error)
            return res.status(500).json(error)
        }
    }
}