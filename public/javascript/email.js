const nodemailer= require('nodemailer')

const sendmail=function(tomail,clubname,text){

const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 587,
   secure: false,
  auth: {
    user: 'testssnclubs@gmail.com',
    pass: 'oxcfyuuyqdwocvov'
  }
});

const mailOptions = {
  from: 'testssnclubs@gmail.com',
  to: `${tomail}`,
  subject: `${clubname}`,
  text: `${text} `
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
 console.log(error);
  } else {
    console.log('Email sent: ' + info.response);  
    // do something useful
  }
});

}

module.exports= sendmail