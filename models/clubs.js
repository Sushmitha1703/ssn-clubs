const mongoose= require('mongoose')
const event= require('./events')
const user= require('./users')
const Schema= mongoose.Schema


const imageSchema= new Schema({
    url:String,
    filename:String
})


const ClubSchema= new Schema({
    title:String,
    description:String,
    clubImages:[imageSchema],
    upcomingEvents:[{
        type:Schema.Types.ObjectId,
        ref:'event'
    }],
    showpageimage:imageSchema,
    presidentname:String,
    presidentdept:String,
    presidentyear:String,
    presidentlinkedin:String,
    vpname:String,
    vpdept:String,
    vpyear:String,
    vplinkedin:String,
    coordname:String,
    coorddept:String,
    coordyear:String,
    coordlinkedin:String,
    members:[
        {
            type:Schema.Types.ObjectId,
            ref:'user'
        }
    ]
})


ClubSchema.post('findOneAndDelete',async function (doc){
     if(doc){
      await event.deleteMany({
          _id:{$in:doc.upcomingEvents}
      })
     }
})

ClubSchema.post('findOneAndDelete',async function (doc){
    if(doc){
     await user.deleteMany({
         _id:{$in:doc.members}
     })
    }
})

module.exports= mongoose.model('club',ClubSchema)