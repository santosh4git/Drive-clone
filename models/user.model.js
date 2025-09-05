const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    verificationCode:String
},{timestamps:true})

const userModel = mongoose.model('userinfo',userSchema)
module.exports = userModel