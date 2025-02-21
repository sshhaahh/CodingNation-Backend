const mongoose=require('mongooose')


const sectionSchema=new mongoose.Schema({
    name:{
        type:String
    },
    subSection:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"subSection"
        }
    ],
})

module.exports=mongoose.model("Section",sectionSchema)

