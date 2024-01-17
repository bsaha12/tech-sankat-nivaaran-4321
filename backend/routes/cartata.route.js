const express = require("express")
const { cardataModel } = require("../model/cardata.model")
// const { blacklistModel } = require("../models/user.model")

const cardataRouter = express.Router()

cardataRouter.get("/",async(req, res)=>{
    try{
        const book = await cardataModel.find(req.query)
        res.status(200).json({books_data:book})
    }
    catch(err){
        res.status(400).json({error:err})
    }
})

cardataRouter.post("/add", async(req, res)=>{
    const payload = req.body
    try{
        const book = new cardataModel(payload)
        await book.save()
        res.status(200).json({msg:"Book added", addedBook: payload})
    }
    catch(err){
        res.status(400).json({error:err})
    }
})

cardataRouter.patch("/update/:bookid",async(req, res)=>{
    const bookid =req.params.bookid
    try{
        await cardataModel.findByIdAndUpdate({ _id: bookid }, req.body);
       
        res.status(200).json({msg:"Book has been updated"})
    }
    catch(err){
        res.status(400).json({error:err})
    }
})

cardataRouter.delete("/delete/:bookid", async(req, res)=>{
    const bookid =req.params.bookid
    try{
        await cardataModel.findByIdAndDelete({ _id: bookid });
        
        res.status(200).json({msg:"Book has been deleted"})
    }
    catch(err){
        res.status(400).json({error:err})
    }
})

module.exports={
    cardataRouter
}