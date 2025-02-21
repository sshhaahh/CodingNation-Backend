const { default: mongoose } = require("mongoose")
const mongooose=require("mongoose")
const courseSchema=new mongooose.Schema({
    courseName:{
        type:String,
        trim:true
    },
    courseDescription:{
        type:String,
        trim:true,
    },
    instructor:{
        type:mongooose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    whatYouWillLearn:{
        type:String,
        trim:true
    },
    courseContent:{
        type:mongooose.Schema.Types.ObjectId,
        ref:"Section"
    },
    ratingAndReviews:{
        type:mongooose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
    },
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag"
    },
    studentEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    ]
})
module.export= mongooose.model("Course",courseSchema)