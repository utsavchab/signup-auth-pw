const JWT = require("jsonwebtoken")

const jwtAuth = (req, res, next) => {
    const token = req.body.token || null;
    if(!token){
        return res.status(401).json({
            message: "",
            success: false
        })
    }else{ 
        try{
            const payload = JWT.verify(token, process.env.JWT_SECRET)
            req.user = payload
            next()
        }catch(err){
            return res.status(400).json({
                message: "Login expired! Please login again.",
                success: false
            })
        }
    }
}

module.exports = jwtAuth