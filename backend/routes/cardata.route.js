const express = require("express")
const { cardataModel } = require("../model/cardata.model")
// const { blacklistModel } = require("../models/user.model")

const cardataRouter = express.Router()

cardataRouter.get("/",async(req, res)=>{
    try{
        const car = await cardataModel.find(req.query)
        res.status(200).json({cars_data:car})
    }
    catch(err){
        res.status(400).json({error:err})
    }
})

cardataRouter.post("/add", async(req, res)=>{
    const payload = req.body
    try{
        const car = new cardataModel(payload)

        await car.save()
        res.status(200).json({msg:"car added", addedcar: payload})
    }
    catch(err){
        res.status(400).json({error:err})
    }
})
cardataRouter.get('/car/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await cardataModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

cardataRouter.patch("/update/:carid",async(req, res)=>{
    const carid =req.params.carid
    try{
        await cardataModel.findByIdAndUpdate({ _id: carid }, req.body);
       
        res.status(200).json({msg:"Book has been updated"})
    }
    catch(err){
        res.status(400).json({error:err})
    }
})

cardataRouter.delete("/delete/:carid", async(req, res)=>{
    const carid =req.params.carid
    try{
        await cardataModel.findByIdAndDelete({ _id: carid });
        
        res.status(200).json({msg:"Book has been deleted"})
    }
    catch(err){
        res.status(400).json({error:err})
    }
})

module.exports={
    cardataRouter
}