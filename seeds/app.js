const seed= require('./seed')
const mongoose= require('mongoose')
const club= require('../models/clubs')


mongoose.connect('mongodb://localhost:27017/ssnclubs')

const db= mongoose.connection
db.on('error',console.log.bind(console,'connection error'))
db.once('open',()=>{
    console.log('database connected')
})

const seeddata=async()=>{
    await club.deleteMany({})
    for(i=0;i<3;i++){
        const newclub= new club({
            title:`${seed[i].title}`,
            description:`${seed[i].description}`,
            showpageimage:{
                url:"https://res.cloudinary.com/du0lm77ah/image/upload/v1669622678/ssnclubs/img1_ptqrwa.jpg",
                filename:'ssnclubs/img1_ptqrwa'
            },
            clubImages:[
                {
                    url:"https://res.cloudinary.com/du0lm77ah/image/upload/v1669618654/ssnclubs/wenmczeongda4z21p05t.jpg",
                    filename:'ssnclubs/wenmczeongda4z21p05t'
                },
                {
                    url:"https://res.cloudinary.com/du0lm77ah/image/upload/v1669618647/ssnclubs/tyf18hn9rrmxmyx8v3bn.jpg",
                    filename:'ssnclubs/tyf18hn9rrmxmyx8v3bn'
                },
                {
                    url:"https://res.cloudinary.com/du0lm77ah/image/upload/v1669573511/ssnclubs/aqtigzqme5syomaf6jpy.jpg",
                    filename:'ssnclubs/aqtigzqme5syomaf6jpy'
                }
            ],
            presidentname:'subkisha',
            presidentdept:'it',
            presidentyear:'3rd',
            presidentlinkedin:'linkedin',
            vpname:'subkisha',
            vpdept:'it',
            vpyear:'3rd',
            vplinkedin:'linkedin',
            coordname:'subkisha',
            coorddept:'it',
            coordyear:'3rd',
            coordlinkedin:'linkedin',
        })
        await newclub.save()
    }
}

seeddata();