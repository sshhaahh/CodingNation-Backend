const Course=require('../models/Course');
const Tag=require("../models/tags");
const User=require("../models/User");
const {uploadImageToCloudinary}=require('../utils/imageUploader');
require('dotenv').config();
exports.createCourse=async(req,res)=>{
    try{
        const {courseName, courseDescription, whatYouWillLearn, price, tag}=req.body;
        const thumbnail=req.files.thumbnailImage;

        if(!courseName || !courseDescription || !thumbnail || !whatYouWillLearn || !price || !tag){
            return res.json({
                success:false,
                message:"Please input all field!"
            })
        }

        const userId=req.user.id;
        const instructorDetail=await User.findById(userId)
        console.log("Instructor detail : ",instructorDetail)

        if(!instructorDetail){
            return res.status(401).json({
                success:false,
                message:"Instructor not found for create course!"
            })
        }

        const tagDetails=await Tag.findById(tag)
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"Tag not found!"
            })
        }


    const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
    if(!thumbnailImage){
        return res.json({
            success:false,
            message:"Thumbnail not found!"
        })
    }
    const newCourse=await Course.create({
        courseName,
        courseDescription,
        instructor:instructorDetail._id,
        whatYouWillLearn,
        price,
        tag:tagDetails._id,
        thumbnail:thumbnail.secure_url,
    })

    await User.findByIdAndUpdate({_id:instructorDetail._id},
        {
            $push : {
                courses:newCourse._id,
            }
        },
        {new:true}
    )

    await Tag.findByIdAndUpdate({_id:tag},
        {
            $push:{
                course:newCourse._id,},
        },{new:true}
    )

    return res.status(200).json({
        success:true,
        message:"Course created successfull.",
        data:newCourse,
    })

    }catch(e){
        console.log("Course not created",e);
        return res.status(501).json({
            success:false,
            message:"Course created failed!"
        })
    }
}



exports.showAllCourses=async(req,res)=>{
    try{
        const allCourses=await Course.find({}).populate("instructor").exec();
        return res.status(200).json({
            success:true,
            message:"Successfully fetch courses.",
            data:allCourses,
        })
    }catch(e){
        console.log("Failed to fetch all Cources.")
        return res.status(500).json({
            success:false,
            message:"Failed to fetch all courses.",
            error:e,
        })
    }
}