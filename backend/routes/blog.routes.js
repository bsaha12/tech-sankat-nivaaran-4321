const mongoose = require("mongoose");
const express = require("express");
const {BlogModel}=require("../model/blog.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const blogroute=express.Router();

//posting blog
blogroute.post("/add",async(req,res)=>{
    const payoad=req.body;
    try{
        const newblog=new BlogModel(req.body)
        await newblog.save();
        res.status(200).json({message:"thank you for your feedback"});
    }catch(err){
        res.status(400).json({message:err});
    }
})

//read
blogroute.get("/",async(req,res)=>{

    try{
        const allblog=await BlogModel.find()
        res.status(200).json(allblog);
    }catch(err){
        res.status(400).json(err);
    }
})

//update
blogroute.patch("/update/:updateid",async(req,res)=>{
    const updateId = req.params.updateid;
    const updatePayload = req.body;
    try{
       const updateblog=await BlogModel.findByIdAndUpdate(updateId,updatePayload)
       res.status(200).json({message:"update sucessfull"});
    }catch(err){
        res.status(400).json(err);
    }
})

//delete
blogroute.delete("/delete/:deleteid",async(req,res)=>{
    const deleteId = req.params.deleteid;
    try{
       const updateblog=await BlogModel.findByIdAndDelete(deleteId)
       res.status(200).json({message:"delete sucessfull"});
    }catch(err){
        res.status(400).json(err);
    }
})


module.exports={
    blogroute
}
