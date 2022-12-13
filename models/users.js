const mongoose= require('mongoose')
const Schema= mongoose.Schema
const clubs= require('./clubs')
const passportLocalMongoose=require('passport-local-mongoose')


const userSchema= new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    clubsAssociated:[{
        type:Schema.Types.ObjectId,
        ref:'club'
    }],
    dept:String,
    year:String
})


userSchema.plugin(passportLocalMongoose)
module.exports= mongoose.model('user',userSchema)