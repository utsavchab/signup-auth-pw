const express = require("express")
const cors = require("cors")
require("dotenv").config()
const axios = require("axios")
const app = express()
const cookiesParser = require("cookie-parser")

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(cookiesParser())

//routes
app.get("/", async (req, res) => {
    try{
        if(req.cookies ){
            const {data} = await axios.post(process.env.SERVER_BASE_URL + '/api/auth' , {token : req.cookies.token}  );
            res.render("home", data.data)
        }else{
            throw ""
        }
    }catch(err){
        res.redirect("/signin")
    }
})

app.get("/signin", async (req, res) => {
    try{
        if(req.cookies && req.cookies.token){
            res.redirect('/')
        }else{
            res.render("signin", {message : ""})
        }
    }catch(err){
        res.render("signin", {message : err.response.data.message})
    }
})

app.post("/signin", async (req, res) => {
    const loginInfo = req.body;
    try{
        const {data} = await axios.post(process.env.SERVER_BASE_URL + '/api/auth/signin', loginInfo);
        const {data:userData, cookieName, token} =  data;
        const cookieOption = {
            expires : new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly : true,
            secure : true
        }
        res.cookie("token", token, cookieOption)
        res.status(200).redirect('/signin')
    }catch(err){

        res.status(307).render("signin", {message : err.response.data.message})
    }
})

app.get("/signup",async  (req, res) => {
    try{
        if(req.cookies && req.cookies.token){
            res.redirect('/')
        }else{
            res.render("signup", {message : ""})
        }
    }catch(err){
        res.render("signup")
    }
})

app.post('/signup', async (req , res) => {
    const signupInfo = req.body;
    try{
        const {data} = await axios.post(process.env.SERVER_BASE_URL + '/api/auth/signup', signupInfo)
        res.status(200).redirect('/signin')
    }catch(err){
        res.status(307).render("signup", {message : err.response.data.message})
    }
})

app.post("/logout", async function(req, res){
    res.clearCookie("token")
    res.redirect("/signin")
})

module.exports = app

