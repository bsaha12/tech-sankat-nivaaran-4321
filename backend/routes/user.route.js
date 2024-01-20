const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/user.model");
const { blacklistModel } = require("../model/blacklist");
const { RideRequestModel } = require("../model/riderequest.model");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

//registration
userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await UserModel.find({ email: email, username: username });
    console.log(user);
    if (user) {
      return res.status(400).json({ msg: "User is alreday existed" });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.status(200).json({ error: err });
      } else {
        const user = await new UserModel({
          username,
          email,
          password: hash,
        });
        await user.save();
        console.log(user);
        res.status(200).json({
          msg: "The new user has been registered",
        });
      }
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

//login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { userId: user._id, name: user.name },
            "masai",
            { expiresIn: "7d" }
          );
          res.status(200).json({ msg: "Logged in successfully", token });
        } else {
          res.status(200).json({ error: err });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

//logout
userRouter.get("/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const blacklist = new blacklistModel({ token });
    await blacklist.save();
    res.status(200).json({ msg: "User has been logged out ." });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

//store riderequest in DB
userRouter.post("/requestRide", async (req, res) => {
  const { username, startLocation, destinationLocation } = req.body;
  try {
    const newRideRequest = new RideRequestModel({
      username,
      startLocation: startLocation,
      destinationLocation: destinationLocation,
    });
    await newRideRequest.save();

    res.status(200).json({ message: "Ride request sent successfully" });
  } catch (error) {
    console.error("Failed to process ride request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get rides
userRouter.get("/rides", async (req, res) => {
  try {
    const rideRequests = await RideRequestModel.find();
    res.status(200).json({ rideRequests });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// get specific user by username
userRouter.get("/profile/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await UserModel.findOne({ username });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// update profile of specific user by username
userRouter.patch("/updateprofile/:username", async (req, res) => {
  const { username } = req.params;
  const { name, bio, birthday, phone, website } = req.body;
  const payload = { name, bio, birthday, phone, website };
  try {
    const user = await UserModel.findOneAndUpdate({ username }, payload);
    res.status(200).json({ msg: "profile updated succcessfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = {
  userRouter,
};
