const express = require("express")
const cors = require("cors")
const axios = require("axios")
const ejs = require('ejs')
const cookiesParser = require("cookie-parser")
require("dotenv").config()

const app = express()
const userRoutes = require("./routes/userRoutes.js")
const connectToDb = require("./config/connectDataBase.js")

connectToDb()
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.use(express.static('public'))
app.use(cookiesParser())
app.set('view engine', 'ejs');

//routes

app.use("/api/auth", userRoutes)

module.exports = app