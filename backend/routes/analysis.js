const express = require('express');
const mongoose = require('mongoose');
// const app = express();
require("dotenv").config();
const analysisRouter=express.Router();
const {UserModel}=require("../model/user.model");
const { DriverModel } = require("../model/driver.model");
// const connection = mongoose.connect();
mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });



analysisRouter.get('/stats', async (req, res) => {
    try {
      const totalAdmins = await UserModel.countDocuments({ role: 'admin' });
      const totalsuperadmin = await UserModel.countDocuments({ role: 'super-admin' });
      const totaladmistrator = await UserModel.countDocuments({ role: { $in: ["admin", "super-admin"] } });
      const totalUsers = await UserModel.countDocuments({ role: 'user' });
      const totalDrivers = await DriverModel.countDocuments();
  
      // You can add more logic to calculate the total services, etc.
  
      res.json({
        totalAdmins,
        totalsuperadmin,
        totalUsers,
        totaladmistrator,
        totalDrivers,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  module.exports={
    analysisRouter
  }