const express= require('express')
const club= require('../models/clubs')
const bodyParser= require('body-parser')
const methodOverride=require('method-override')
const router= express.Router()
const catchasync= require('../utils/Asyncerrors')
const catchexpress= require('../utils/expresserrors')
const event=require('../models/events')
const users = require('../models/users')
const passport = require('passport')
const multer= require('multer')
const {storage}= require('../cloudinary/index')
const upload= multer({storage:storage})
const {loggedin,isadmin,isincharge}= require('../middleware')
const sendmail= require('../public/javascript/email')



router.use(methodOverride('_method'))
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get('/',(req,res)=>{
    res.render('home.ejs')
})


router.get('/club/:id/edit',isincharge,catchasync(async(req,res)=>{
  const {id}= req.params
  const clubs= await club.findById(id)
  res.render('editclub.ejs',{clubs})
}))

router.get('/club',catchasync(async(req,res)=>{
  const newclubs= await club.find({})
  res.render('index.ejs',{newclubs})
}))

router.get('/club/new',loggedin,catchasync(async(req,res)=>{
  res.render('newclub.ejs')
}))
 
router.get('/club/:id',catchasync(async(req,res)=>{
  const {id}= req.params
  const clubs= await club.findById(id).populate('upcomingEvents')
  res.render('show',{clubs})
}))

router.get('/club/:id/newevent/form',loggedin,isadmin,async(req,res)=>{
  const {id}= req.params
  const clubs= await club.findById(id)
  res.render('events/newevent',{clubs})
})

router.post('/club',upload.fields([
  { 
    name: 'clubImages', 
    maxCount: 8 
  }, 
  { 
    name: 'showpageImage', 
    maxCount: 1 
  }
]),async(req,res)=>{
 const newclub= new club(req.body.clubs)
 console.log(req.files.showpageImage[0])
 newclub.showpageimage= ({url:req.files.showpageImage[0].path, filename:req.files.showpageImage[0].filename})
 newclub.clubImages=req.files.clubImages.map(f=>({url:f.path, filename:f.filename}))
 await newclub.save()
 res.redirect(`club/${newclub._id}`)
})


router.post('/club/:id/newevent',loggedin,async(req,res)=>{
  const {id}= req.params
  const clubss= await club.findById(id).populate('members')
  const events= new event(req.body.event)
  clubss.upcomingEvents.push(events)
  await events.save()
  await clubss.save()
  const text= `Greetings from ${clubss.title}, A new event ${events.text} has been posted, kindly check it out on the website`
  for(let c of clubss.members){
    sendmail(c.email,clubss.title,text)
  }
  req.flash('success','successfully added an event')
  res.redirect(`/club/${clubss._id}`)
})

router.put('/club/:id',catchasync(async(req,res)=>{
  const {id}=req.params
  const clubs= await club.findById(id)
  if(!clubs){
    req.flash('error','Cannot find that club')
    return res.redirect(`/club/${clubs._id}`)
  }
  const clubss=await club.findByIdAndUpdate(id,{...req.body.clubs},{new:true})
  await clubs.save()
  req.flash('success','Successfully Updated clubs')
  res.redirect(`/club/${clubss._id}`)


 // const clubs= await club.findByIdAndUpdate(id,{...req.body.clubs},{new:true})

 // res.redirect(`/club/${clubs._id}`)*/
 console.log(req.files,req.body)
 res.send('it worked')
}))


router.get('/club/:id/gallery',async(req,res)=>{
  const {id}= req.params
  const clubsss= await club.findById(id)
  res.render('imagegallery',{clubsss})
})


router.delete('/club/:id/newevent/:eventId',async(req,res)=>{
  const {id,eventId}= req.params
  await club.findByIdAndUpdate(id,{$pull:{upcomingEvents:eventId}})
  await event.findByIdAndDelete(eventId)
  const clubss= await club.findById(id).populate('members')
  req.flash('success','successfully deleted event')
  const text= `Greetings from ${clubss.title}, A new event has been postponed or cancelled :(, kindly check it out on the website`
  for(let c of clubss.members){
    sendmail(c.email,clubss.title,text)
  }
  res.redirect(`/club/${id}`)
})

router.delete('/club/:id',isincharge,catchasync(async(req,res)=>{
  const {id}= req.params
  await club.findByIdAndDelete(id)
  res.redirect('/club')
}))


router.post('/club/:id/members/:profileId',loggedin,async(req,res)=>{
  const {id,profileId}=req.params
  const clubss= await club.findById(id)
  const user= await users.findById(profileId)
  if(user.clubsAssociated.includes(id)){
  req.flash('error','you are already a member of that club')
  res.redirect(`/club/${id}`)
  }
  else{
  const newmember= user
  clubss.members.push(newmember)
  user.clubsAssociated.push(clubss)
  await clubss.save()
  await user.save()
  const text= `Greetings from ${clubss.title},Welcome to ${clubss.title}. We are glad to have you in. Stay tuned to more ! `
  sendmail(user.email,clubss.title,text)
  req.flash('success',` Welcome to ${clubss.title} please check your mail for confirmation if not please check your spam `)
  res.redirect(`/club/${clubss._id}`)
  }
})

//---------------------------------------------------------//
//user

router.get('/register',async(req,res)=>{
  res.render('users/register')
})

router.post('/register',async(req,res)=>{
  try{
  const {username,email,password,dept,year}= req.body
  if(email.endsWith('@ssn.edu.in')){
    const newuser= new users({email,username,dept,year})
    const registereduser= await users.register(newuser,password);
    req.login(registereduser,err=>{
      if(err){
          
          return next(err);
      }
      else{
          req.flash('success','Welcome to SSN Clubs')
          sendmail(req.user.email,'ssn clubs','Welcome to ssn clubs')
          res.redirect('/club')
      }
  })
  }
  else{
    req.flash('error','please register with your ssn email')
    res.redirect('/register')
  }
}
catch(e){
  req.flash('error',e.message)
  res.redirect('/register')
}
})




router.get('/login',async(req,res)=>{
  res.render('users/login')
})


router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','welcome back')
    const redirecturl = req.session.returnTo || '/club'
    delete req.session.returnTo
    console.log(req.user)
    res.redirect(redirecturl)
})



router.get('/profile/:profileId',loggedin,async(req,res)=>{
  const {profileId}= req.params
  const user=await users.findById(profileId).populate('clubsAssociated')
  res.render('users/profilepage',{user})
})


router.get('/logout',(req,res)=>{
   req.logOut(function(err) {
    if (err) { return next(err); }
    req.flash('success','Seeya ya soon')
    res.redirect('/');
})})

/*router.all('*',(req,res,next)=>{
  next(new catchexpress('page not found',404))
})

router.use((err,req,res,next)=>{
const { message='something went wrong',Statuscode=500}=err
res.status(Statuscode).render('error',{err})
})
*/
module.exports= router
