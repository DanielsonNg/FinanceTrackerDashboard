const User = require("../models/user.model")


module.exports = {
    async getUserData(req,res){
        try {
            const {userId} = req.body

            const userFind = await User.findById(userId)

            if(!userFind){
                return res.status(404).json({response_message:"User Not Found"})
            }

            return res.status(200).json({
                userData:{
                    name:userFind.name,
                    isVerified: userFind.isVerified
                }
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

}