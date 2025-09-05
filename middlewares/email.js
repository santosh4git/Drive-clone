const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "santosh.ks.sbp@gmail.com",
    pass: "zjlp tffd mffb tkex",
  },
});

const sendVerificationCode = async(email,verificationCode)=>{
    try{
        const response = await transporter.sendMail({
        from: '"Santosh this side " <santosh.ks.sbp@gmail.com>',
         to:email ,
         //"priyanshu210021@gmail.com",
        subject: "OTP SEND ✔",
        text: "Hello sir otp jara confirm kareiye ", // plain‑text body
        html: verificationCode
        })
        console.log('Email sent successfully', response);
        
    }catch(err){
        console.log('Fail to send mail')
    }
}

module.exports = sendVerificationCode