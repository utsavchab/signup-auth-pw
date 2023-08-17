const express = require("express");

const { userSignUp, userSignIn, userLogout } = require("../controllers/userControllers.js");
const jwtAuth = require("../middleware/jwtAuth.js");
const passwordChangeAuth = require("../middleware/passwordChangeAuth.js");


const router = express.Router()

router.post("/signup", userSignUp)
router.post("/signin", userSignIn)

router.post("/" ,jwtAuth, passwordChangeAuth, (req, res) => {
    try{
        const userData = req.user.data;
        userData.password = undefined
        return res.status(200).json({
            success: true,
            data: userData
        })
    }catch(err){
        return res.status(400).json({
            success: false,
            message: ""
        })
    }
})

router.get("/logout", userLogout)
module.exports = router;