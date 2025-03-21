const User = require("../models/User")
const mailSender=require("../utils/mailSender")
const bcrypt=require("bcrypt")

exports.resetPasswordToken=async(req,res)=>{
    try{
        const {email}=req.body;
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found for forgot password."
            })
        }
        const token = crypto.randomUUID();
        const updateDetails=await User.findByIdAndUpdate({email:email},
                            {
                                token:token,
                                resetPassExpireTime:Date.now()+5*60*1000,
                            },
                            {new:true}
        )
    
        const url=`https://localhost:3000/update-password/${token}`
    
        await mailSender(email,"Coding Nation password forgot link",`Click here for reset : ${url}`);
    
        return res.json({
            success:true,
            message:"Password forgot link send successfull."
        })
    }catch(e){
        console.log("Link send failed for password forgot.")
}

}


exports.resetPassword=async(req,res)=>{
    try{
        const {newPassword,confirmPassword,token}=req.body;


        if(newPassword!==confirmPassword){
            return res.json({
                success:false,
                message:"New and Confirm password not match."
            })
        }
        const userDetails=await User.findOne({token:token});
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token not found for reset password"
            })
        }

        if(userDetails.resetPassExpireTime < Date.now()){
            return res.json({
                success:false,
                message:"Token expired for reset password."
            })
        }

        const hashPassword=await bcrypt.hash(newPassword,10);

        User.findOneAndUpdate(
            {token:token},
            {password:hashPassword},
            {new:true}
        )
        return res.status(200).json({
            success:true,
            message:"password reset successfull."
        })
    }catch(e){
        console.log("Reset Password failed because of : ", e)
        return res.json({
            success:false,
            message:"Reset password failed"
        })
    }
}