const User=require('../models/User');
const OTP=require('../models/Otp');
const otpGenerator=require('otp-generator');
const Profile = require('../models/Profile');
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
require("dotenv").config();
exports.sendOTP=async(req,res)=>{
    try{
        const {email}=req.body;

        const checkUser =await User.findOne({email});

        if(checkUser){
            return res.status(401).json({
                success:false,
                message:"User Already Exist!"
            })
        }

        var otp=otpGenerator.generate(6,{
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false,
        })

        console.log("Otp is : ",otp)

        const otpPayload={email,otp};

        const otpBody=await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(201).json({
            success:true,
            message:"Otp send successfully."
        })
    }catch(e){
        res.status(500).json({
            success:false,
            message:"Otp not send."
        })
        console.log(e)
    }
    
}
// ------------------------sign Up--------------------------------
exports.signUp=async(req,res)=>{
    try{
        const {firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp}=req.body;   

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp || !contactNumber){
            return res.json({
                success:false,
                message:"All field are required!"
            })
        }
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password and Confirm Password not Match."
            })
        }
        const userExist=await User.findOne({email});
        if(userExist){
            return res.status(409).json({
                success:false,
                message:"User already registered."
            })
        }
        

        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        if (!recentOtp) {
            return res.status(404).json({
                success:false,
                message:"OTP not found in database."
            })
        }else if(otp!==recentOtp[0].otp){
            return res.status(401).json({
                success:false,
                message:"Wrong OTP."
            })
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
        });


        const user= await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        })

        return res.status(200).json({
            success:true,
            message:"User Created successfully.",
            data:user,
        })
    }catch(e){
        console.log(e)
        return res.json({
            success:false,
            message:"User not created."
        })
    }

}

exports.logIn=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"Please enter email and password",
            })
        }

        const user=await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.json({
                success:false,
                message:"Email not found, Sign Up here "
            });
        }

        if(await bcrypt.compare(password,user.password)){
            const token=jwt.sign(
                {id:user._id,email:user.email,role:user.accountType},
                process.env.JWT_SECRET,
                {expiresIn:"1h"}
            )
            user.token=token;
            user.password=undefined;

            const options={
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true

            }
            res.cookie("cookie",token,options).status(200).json({
                success:true,
                message:"Login Successfully",
                user,
                token,
            })
        }else{
            return res.status(401).json({
                success:false,
                message:"Password Incorrect!"
            })
        }

    }catch(e){
        console.log(e);
        return res.json({
            success:false,
            message:"Log in failed!"
        })
    }
}

exports.changePassword=async(req,res)=>{
    try{
        const {email,password,newPassword,confirmPassword}=req.body;

        if(!password || !newPassword || !confirmPassword){
            return res.json({
                success:false,
                message:"Please enter new and old Password."
            })
        }

        if(newPassword !== confirmPassword){
            return res.json({
                success:false,
                message:"New and Confirm Password not match!"
            });
        }

        const user=await User.findOne({email})
        if(!user){
            return res.json({
                success:false,
                message:"User not found for change password!"
            })
        }

        if(await bcrypt.compare(password,user.password)){

            const hashedPassword=await bcrypt.hash(newPassword,10);
            await User.findByIdAndUpdate(user._id,{password:hashedPassword})
            
            return res.json({
                success:true,
                message:"Password change successfully."
            })

        }else{
            return res.json({
                success:false,
                message:"Old password incorrect!"
            })
        }
        
    }
    catch(e){
        return res.json({
            success:false,
            message:"Password Not change!"
        })
    }
}