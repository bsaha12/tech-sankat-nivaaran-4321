
const { mongoose } = require("mongoose");
const carDataSchema = mongoose.Schema({
    image:{
        type : String,
        require : true
    },
    name:{
        type : String,
        require : true
    },
    description:{
        type : String,
        require : true
    },
    price:{
        type : Number,
        require : true
    }
},{
    versionKey: false
})

const carDataModel= mongoose.model("car", carDataSchema)

module.exports={
    carDataModel
}