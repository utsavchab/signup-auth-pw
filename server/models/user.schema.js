const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required : [true, "Name is Required"],
        maxLength : [50, "Name should contain at max 50 characters"],
        minLength : [5, "Name should contain at least 5 characters"],
        trim : true
    },

    username : {
        type: String,
        validate: {
            validator: function(value) {
              return !/\s/.test(value);
            },
            message: props => `${props.value} contains spaces, which are not allowed in the username.`
        },
        required : [true, "username is required"],
        unique : [true, "This username is already in use"]
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : [true, "This email is already in use"],
    },
    password : {
        type : String,
        minLength : [8, "Password should contain at least 8 characters"],
        required : [true, "Password is required"],
        select : false
    },
    bio : {
        type : String,
    },
    passwordChangeDate : {
        type : Date,
        default : Date.now()
    },
    followers_count : {
        type: Number,
        default : 0,
        minimum : 0
    }
    
},{
    timestamps: true
})

userSchema.pre("save", async function(next){

    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }

    return next();
})

userSchema.methods = {
    generateToken () {
        const token = JWT.sign({id : this._id}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRES_IN})
        return token
    }
}

const User = mongoose.model('user', userSchema)
module.exports = User