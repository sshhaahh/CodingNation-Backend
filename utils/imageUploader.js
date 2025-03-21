const cloudinary=require('cloudinary').v2

exports.uploadImageToCloudinary=async(file,folder,height,quality)=>{
    try{
        const options={folder}
        if(height){
            options.height=height
        }
        if(quality){
            options.quality=quality
        }
        

        return await cloudinary.uploader.upload(file.tempfilePath, options)
    }catch(e){
        console.log("upload image to cloudinat failed")
    }
    
}