const mongoose = require("mongoose")

const connectToDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true
        })
        console.log(`MongoDB Connected : ${conn.connection.host}`)

    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectToDb