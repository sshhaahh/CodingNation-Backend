const mongoose=require('mongooose');
const mailSender = require('../utils/mailSender');


const otpSchema=new mongoose.Schema({
   email:{
    type:String,
    required:true,
   },
   otp:{
        type:String,
        required:true
   },
   createdAt:{
    type:Date,
    default:Date.now(),
    expires:10*60,
   }
})

async function sendVarificationMail(email,otp){
   try{
      const mailResponse=await mailSender(email,"Verification from Coding Nation by Shah",body);
      console.log("Email sent successfully: ",mailResponse)
   }catch(e){
      console.log("email not sent",e)
      throw e;
   }
}

otpSchema.pre("save",async function(next){
   await sendVarificationMail(this.email,this.otp);
   next();
})
module.exports=mongoose.model("OTP",otpSchema)

