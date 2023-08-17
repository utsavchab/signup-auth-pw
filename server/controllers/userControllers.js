const User = require("../models/user.schema.js")
const emailValidator = require("email-validator")
const bcrypt = require("bcrypt")


const userSignUp = async (req, res) => {

    const { email} = req.body;

    const isEmailValid = emailValidator.validate(email)
    if(!isEmailValid){
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email id"
        })
    }

    try{

        const newUser = new User(req.body)
        const userData = await newUser.save()
        userData.password = undefined
        return  res.status(200).json({
            success: true,
            message: "User created successfully",
            data: userData
        })

    }catch(err){

        if(err.code == 11000){
            if(err.keyValue.email){
                return res.status(400).json({
                    success : false,
                    message : `Email id '${err.keyValue.email}' is already in use`
                })
            }else{
                return res.status(400).json({
                    success : false,
                    message : `username '${err.keyValue.username}' is already in use`
                })
            }
        }

        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

const userSignIn = async (req, res) => {

    const {username, password} = req.body;

    //Check for empty fields
    if(!username || !password){
        
        return res.status(400).json({
            success: false,
            message: "All input fields are required"
        })
        // redirect('/api/auth/signin?message=' + encodeURIComponent("All input fields are required"));
    }

    try{
        const userData = await User.findOne({username}).select('+password')
        if(!userData || !(await bcrypt.compare(password, userData.password))){
            return res.status(400).json({
                success: false,
                message: "Username or Password is incorrect"
                
            })
        }

        userData.password = undefined

        const cookieOption = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000),
            httpOnly: true,
            secure: true
        }

        // res.cookie("token", userData.generateToken(), cookieOption)


        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token : userData.generateToken(),
            cookieOption : cookieOption,
            cookieName : "token",
            data: userData
        })

    }catch(err){
        return res.status(400).json({
            success: false,
            message: err.message
        })
        //redirect('/api/auth/signin?message=' + encodeURIComponent(err.message));
    }
}

const getUser = (req, res) => {
    
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
            message: err.message
        })
    }
}

const userLogout = (req, res) => {
    try{
        const cookieOption = {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true
        }
        res.cookie("token", null, cookieOption)
        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    }catch(err){
        return res.status(400).json({
            success: false,
            message: err.message
        })
        //redirect('/api/auth/signin?message=' + encodeURIComponent(err.message));
    }
}
module.exports ={ 
    userSignUp,
    userSignIn,
    getUser,
    userLogout
};
