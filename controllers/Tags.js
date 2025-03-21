const Tag=require("../models/tags");

exports.createTag=async(req,res)=>{
    try{
        const {name,description}=req.body;
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields require!"
            })
        }
        const tagDetails=await Tag.create({
            name:name,
            description:description,
        })

        return res.status(200).json({
            success:true,
            message:"Tag created successfully."
        });
    }catch(e){
        console.log(e)
        return res.status(501).json({
            success:false,
            message:"Tag failed to create."
        })
    }
}





exports.showAllTags=async(req,res)=>{
    try{
        const allTags=await Tag.find({},{name:true,description:true})
        return res.status(200).json({
            success:true,
            data:allTags,
            message:"Tags show successfull."
        })
    }catch(e){
        return res.json(501).json({
            success:false,
            message:"Failed to show tags"
        })
    }
}