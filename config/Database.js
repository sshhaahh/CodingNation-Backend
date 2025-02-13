const mongoose=require('mongoose')
require("dotenv").config()
const connect=()=>{
    const URL=process.env.DB_URL

    if(!URL){
        console.log("DB Url not found");
        process.exit(1);
    }
    mongoose.connect(URL)
    .then(()=>{console.log("DB Connected Successfully")})
    .catch((e)=>{
        console.log("DB not Connect : ",e)
        process.exit(1);
    })

}
module.exports=connect