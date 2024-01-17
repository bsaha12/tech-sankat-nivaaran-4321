const express = require("express")
const { carDataModel } = require("../model/cardata.model")


const carDataRouter = express.Router()


carDataRouter.get("/" ,async(req, res)=>{
    try{
        const cardata = await carDataModel.find(req.query)
        res.status(200).json({cars_data:cardata})
    }
    catch(err){
        res.status(400).json({error:err})
    }
})


carDataRouter.post("/addcar",async(req, res)=>{
    const payload = req.body
    try{
        const cardata = new carDataModel(payload)
        await cardata.save()
        res.status(200).json({msg:"car details added", cardata: payload})
    }
    catch(err){
        res.status(400).json({error:err})
    }
})


module.exports={
    carDataRouter
}