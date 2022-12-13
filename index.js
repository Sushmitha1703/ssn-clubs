if(process.env.NODE_ENV!=='production'){
    require('dotenv').config()
}

const express= require('express')
const app= express()
const mongoose= require('mongoose')
const session= require('express-session')
const ejsMate= require('ejs-mate')
const flash= require('connect-flash')
const passport= require('passport')
const localstrategy= require('passport-local')
const indexRouter= require('./routes/routes')
const users = require('./models/users')

mongoose.connect('mongodb://localhost:27017/ssnclubs')

const db= mongoose.connection
db.on('error',console.log.bind(console,'connection error'))
db.once('open',()=>{
    console.log('database connected')
})

const sessionConfig={
    secret:'thisisasupersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now + 1000*60*60*24*7 , 
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session());
passport.use(new localstrategy(users.authenticate()))


passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.use('/public',express.static(__dirname+'/public'))



app.use((req,res,next)=>{
    res.locals.currentUser= req.user
    res.locals.success = req.flash('success')
    res.locals.error=req.flash('error')
    next();
})


app.use('/',indexRouter)

app.listen('3000',()=>{
    console.log('listening on port 3000')
})