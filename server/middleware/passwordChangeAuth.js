const User = require("../models/user.schema.js")

const passwordChangeAuth = async (req, res, next) => {
    const userId = req.user.id;
    try{
        
        const userData = await User.findById(userId)
        const passwordChangeDate = userData.passwordChangeDate;

        if(passwordChangeDate.getTime() >= req.user.iat*1000){
            return res.status(401).json({
                message: "Password has been changed. Please login again.",
                success: false
            })
        }else{
            req.user.data = userData
            return next()
        }
        
    }catch(err){
        return res.status(400).json({
            message: err.message,
            success: false
        })
    }
}

module.exports = passwordChangeAuth;