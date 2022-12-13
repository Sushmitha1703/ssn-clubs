const { findById } = require("./models/clubs");

module.exports.loggedin =(req,res,next)=>{
    if(!req.isAuthenticated()){
       req.flash('error','Sign in to view')
       return res.redirect('/login')
    }
    else{
     next();
    }
  }

module.exports.isadmin= async(req,res,next)=>{
     if(req.user.username!=='adminssn'){
         req.flash('error','You do not have permission to do that')
         return res.redirect('/club')
     }
     else{
     next();
     }
 }

 module.exports.isincharge= async(req,res,next)=>{
  if(req.user.username!=='incharge'){
      req.flash('error','You do not have permission to do that')
      return res.redirect('/club')
  }
  else{
  next();
  }
}