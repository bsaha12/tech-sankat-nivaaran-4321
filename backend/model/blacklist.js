const mongoose=require("mongoose");
const blacklistSchema=mongoose.Schema({
        token :{type:String,require:true},
},
{
        versionKey:false,
})
const blacklistModel=mongoose.model("blacklist",blacklistSchema)
module.exports={
        blacklistModel
}