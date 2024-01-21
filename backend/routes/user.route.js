const express= require("express");
const bcrypt =require("bcrypt");
const multer = require('multer');
const path = require('path');
const {UserModel}=require("../model/user.model");
const {blacklistModel}=require("../model/blacklist");
const{RideRequestModel}=require("../model/riderequest.model")
const { extractUserMiddleware } = require("../middlewares/extract.User.Middleware");
const { checkAdminRole } = require("../middlewares/checkAdminRole.middlewear");
const { authenticateToken } = require("../middlewares/authentication.middlwear")
const userRouter=express.Router();
const jwt=require("jsonwebtoken");


const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, '../frontend/uploads/'); 
        },
        filename: function (req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, 'profile-' + Date.now() + ext);
        },
      });

      const upload = multer({ storage: storage });


// Update user profile route with image upload
userRouter.patch('/profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
        try {
          const userId = req.user.userId;
          const { newadminname, newEmail, newPhone, newDesignation ,newdateofBirth} = req.body;
      
          const imageUrl = req.file ? req.file.path : null;
      
      
          const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
              $set: {
                adminname:newadminname,
                // email: newEmail,
                phoneNumber: newPhone,
                designation: newDesignation,
                image: imageUrl.replace(/\\/g, '/'),
                dateofBirth: newdateofBirth
              },
            },
            { new: true } 
          );
      
          if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
          }
      
          res.status(200).json(updatedUser);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });


// get own profile
userRouter.get('/profile', authenticateToken, async (req, res) => {
        try {
          const userId = req.user.userId;
      
          const user = await UserModel.findById(userId);
      
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
      
          res.status(200).json(user);
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });




      
userRouter.get("/admin", extractUserMiddleware, checkAdminRole, async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
    
            const skip = (page - 1) * limit;
            const users = await UserModel.find({ role: { $in: ["admin", "super-admin"] } })
                .skip(skip)
                .limit(limit);
    
            const totaladmin = await UserModel.countDocuments({ role: { $in: ["admin", "super-admin"] } });
    
            const totalPages = Math.ceil(totaladmin / limit);
    
            res.status(200).json({
                users_data: users,
                page: page,
                limit: limit,
                totalAdmin: totaladmin,
                totalPages: totalPages,
            });
    
            console.log(users);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });

    userRouter.get("/riders", extractUserMiddleware, checkAdminRole, async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
    
            const skip = (page - 1) * limit;
    
            const users = await UserModel.find({ role: { $in: ["user"] } })
                .skip(skip)
                .limit(limit);
    
            const totalusers = await UserModel.countDocuments({ role: { $in: ["user"] } });
    
            const totalPages = Math.ceil(totalusers / limit);
    
            res.status(200).json({
                users_data: users,
                page: page,
                limit: limit,
                totalusers: totalusers,
                totalPages: totalPages,
            });
    
            console.log(users);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });
    

//registration
userRouter.post("/register",async(req,res)=>{
        const{image,adminname, username,email,password,phoneNumber,dateofBirth,designation, role}=req.body;
        console.log(req.body)
        try{
                const user=await UserModel.find({email:email,username:username});
                console.log(user);
                if(user.length > 0){
                        return res.status(400).json({msg:"User is already existed"});
                }
                bcrypt.hash(password,5,async(err,hash)=>{
                        if(err){
                                res.status(200).json({error:err});
                        }else{
                                const user= await new UserModel({
                                  image,adminname, username,email,password:hash,phoneNumber,dateofBirth,designation, role
                                });
                                await user.save();
                                console.log(user);
                                res.status(200).json({
                                        msg:"The new user has been registered"
                                });
                        }
                });
        }catch(err){
                res.status(400).json({error:err})
        }
})
userRouter.post("/login",async(req,res)=>{
        const {username,password }=req.body;
        try{
                const user=await UserModel.findOne({username});
                const role = user.role
                const image = user.image
                console.log(user)
                if(user){
                bcrypt.compare(password,user.password,(err,result)=>{
                        if(result){
                                const token=jwt.sign({userId:user._id,name:user.name},"masai",{expiresIn:"7d"});
                                // localStorage.setItem("role":user.role)
                                // localStorage.setItem("image"=user.image)
                                res.status(200).json({msg:"Logged in successfully",token, role, image});
                        }else{
                                res.status(200).json({error:err});
                        }
                });
        }
        }catch(err){
                res.status(400).json({error:err});
        }
});

userRouter.get("/logout",async(req,res)=>{
        const token =req.headers.authorization?.split(" ")[1];
        try{
                const blacklist=new blacklistModel({token});
                await blacklist.save();
                res.status(200).json({msg:"User has been logged out ."});
        }catch(err){
                res.status(400).json({error:err});
        }
});


userRouter.post("/requestRide", async (req, res) => {
        const { userId, startLocation, destinationLocation } = req.body;
      
        try {
          const newRideRequest = new RideRequestModel({ userId, startLocation, destinationLocation });
          await newRideRequest.save();
      
          broadcastNewRideRequest({ userId, startLocation, destinationLocation });
      
          res.status(200).json({ message: "Ride request sent successfully" });
        } catch (error) {
          console.error("Failed to process ride request:", error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });

      userRouter.patch("/update/:id", async (req, res) => {
        const { id } = req.params;
        const payload=req.body
      
        try {
          if(payload.userId===req.body.userId){
          const updateduser = await UserModel.findByIdAndUpdate({ _id:id},payload);
      res.status(200).json({ message: "user updated successfully", user: updateduser });
        }
            else {
            res.status(404).json({ message: "user not found" });
          }
        }  
          catch (error) {
          console.error("Update failure:", error);
          res.status(400).json({ message: "Update failure", error });
        }
      });
      
      
      
      
      
      
      // delete
      userRouter.delete("/delete/:id", async (req, res) => {
        const { id } = req.params;
      
        try {
          const deleteuser = await UserModel.findByIdAndDelete(id);
      
          if (deleteuser) {
            res.status(200).json({ message: "user deleted successfully", user: deleteuser });
          } else {
            res.status(404).json({ message: "user not found" });
          }
        } catch (error) {
          console.error("Delete failure:", error);
          res.status(400).json({ message: "Delete failure", error });
        }
      });
module.exports={
        userRouter
}