const User = require("../models/User")
require("dotenv").config()
const jwt=require("jsonwebtoken")
exports.auth=async(req,res,next)=>{
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "")
        if(!token){
            return res.json({
                success:false,
                message:"Token not found",
            })
        }

        try{
            const decode=await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode)
            req.user=decode;
            next();
        }catch(e){
            return res.json({
                success:false,
                message:"Invalid token!"
            })
        }
    }catch(e){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validate the token."
        })
    }
}



exports.isAdmin=async(req,res,next)=>{
   try{
    if(req.user.role!=="Admin"){
        return res.json({
            success:false,
            message:"Access Denied. Admin Only."
        })
    }
    next();
   }catch(e){
    return res.status(500).json({
        success:false,
        message:"User invalid!"
    })
   }

}

exports.isStudent=async(req,res,next)=>{
    try{
     if(req.user.role!=="Student"){
         return res.json({
             success:false,
             message:"Access Denied. Student Only."
         })
     }
     next();
    }catch(e){
     return res.status(500).json({
         success:false,
         message:"User invalid!"
     })
    }
 
 }


 exports.isInstructor=async(req,res,next)=>{
    try{
     if(req.user.role!=="Instructor"){
         return res.json({
             success:false,
             message:"Access Denied. Instructor Only."
         })
     }
     next();
    }catch(e){
     return res.status(500).json({
         success:false,
         message:"User invalid!"
     })
    }
 
 }