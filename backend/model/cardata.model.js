const { mongoose } = require("mongoose");
const cardataSchema = mongoose.Schema({
    title:{
        type : String,
        require : true
    },
    genre:{
        type : String,
        require : true
    },
    author:{
        type : String,
        require : true
    },
    year:{
        type : Number,
        require : true
    }
},{
    versionKey: false
})

const cardataModel= mongoose.model("car", cardataSchema)

module.exports={
    cardataModel
}