const mongooose=require("mongoose");

const ratingAndReviewSchema=new mongooose.Schema({
    user:{
        type:mongooose.Schema.Types.ObjectId,
        ref:"User"
    },
    rating:{
        type:Number,
        trim:true,
    },
    review:{
        type:String,
        trim:true
    }
})

module.exports=mongooose.model("RatingAndReview",ratingAndReviewSchema);