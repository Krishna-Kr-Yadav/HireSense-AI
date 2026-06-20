const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true,"Username already taken"],
        unique: true
    },
    email:{
        type: String, 
        unique: true,
        required: [true,"Account already exist with this email id"]
    },
    password:{
        type:String,
        required: true
    }
})

const userModel = mongoose.model("users",userSchema);

module.exports = userModel;