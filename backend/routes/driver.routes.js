const mongoose = require("mongoose");
const express = require("express");
const { DriverModel } = require("../model/driver.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authLogout } = require("../middlewares/driver.auth");

const driverroute = express.Router();

driverroute.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const drivers = await DriverModel.find().skip(skip).limit(limit);

    const totalDrivers = await DriverModel.countDocuments();

    const totalPages = Math.ceil(totalDrivers / limit);

    res.status(200).json({
      drivers_data: drivers,
      page: page,
      limit: limit,
      totalDrivers: totalDrivers,
      totalPages: totalPages
    });

    console.log(drivers);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

function broadcastNewRideRequest(rideRequest, drivers) {
  drivers.forEach((driverWs) => {
    if (driverWs.readyState === WebSocket.OPEN) {
      driverWs.send(JSON.stringify({ type: "newRideRequest", data: rideRequest }));
    }
  });
}



//register
driverroute.post("/register", async (req, res) => {
  const {
    drivername,
    email,
    password,
    experience,
    latitude,
    longitude,
    phoneNumber,
  } = req.body;

  try {
    const driver = await DriverModel.findOne({ email });

    if (driver) {
      res.status(200).json({ message: "User already exists" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        try {
          if (err) {
            console.error("Hashing error:", err);
            res.status(200).json({ message: "Hashing error" });
          } else {
            const newDriver = new DriverModel({
              drivername,
              email,
              password: hash,
              experience,
              latitude,
              longitude,
              phoneNumber,
            });

            await newDriver.save();
            res.status(200).json({ message: "New driver registered" });
          }
        } catch (error) {
          console.error("Registration failed:", error);
          res.status(400).json({ message: "Registration failed" });
        }
      });
    }
  } catch (error) {
    console.error("Registration failure:", error);
    res.status(400).json({ message: "Registration failure", error });
  }
});

//login
driverroute.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const driver = await DriverModel.findOne({ email });

    if (!driver) {
      res
        .status(400)
        .json({ message: "Authentication failed. User not found." });
      return;
    }

    bcrypt.compare(password, driver.password, (err, result) => {
      if (err || !result) {
        res
          .status(400)
          .json({ message: "Authentication failed. Incorrect password." });
      } else {
        const token = jwt.sign(
          { email: driver.email, driverId: driver._id },
          "sankat-nivaaran",
          { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Authentication successful", token });
      }
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Authentication failed. Please try again." });
  }
});

// Logout route
driverroute.post("/logout", authLogout, (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

module.exports = {
  driverroute,
  broadcastNewRideRequest
};
