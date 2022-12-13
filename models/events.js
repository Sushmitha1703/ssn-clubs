const mongoose= require('mongoose')
const DateOnly = require('mongoose-dateonly')(mongoose);
const Schema= mongoose.Schema

const eventSchema= new Schema({
    text:String,
    link:String,
    date:DateOnly,
    description:String,
})

module.exports=mongoose.model('event',eventSchema)