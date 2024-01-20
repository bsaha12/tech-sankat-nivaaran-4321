const mongoose = require("mongoose");
const express = require("express");
const { DriverModel } = require("../model/driver.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authLogout } = require("../middlewares/driver.auth");

const driverroute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Driver
 *   description: Operations related to drivers
 */

/**
 * @swagger
 * /driver:
 *   get:
 *     summary: Get all drivers
 *     tags: [Driver]
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               drivers_data: []
 */

/**
 * @swagger
 * /driver/register:
 *   post:
 *     summary: Register a new driver
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drivername:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               experience:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful registration
 *         content:
 *           application/json:
 *             example:
 *               message: New driver registered
 *       '400':
 *         description: Registration failure
 *         content:
 *           application/json:
 *             example:
 *               message: Registration failure
 */

/**
 * @swagger
 * /driver/login:
 *   post:
 *     summary: Login as a driver
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               message: Authentication successful
 *               token: "your_jwt_token"
 *       '400':
 *         description: Authentication failure
 *         content:
 *           application/json:
 *             example:
 *               message: Authentication failed. User not found.
 */

/**
 * @swagger
 * /driver/logout:
 *   post:
 *     summary: Logout a driver
 *     tags: [Driver]
 *     responses:
 *       '200':
 *         description: Successful logout
 *         content:
 *           application/json:
 *             example:
 *               message: Logout successful
 */

/**
 * @swagger
 * /driver/update/{id}:
 *   patch:
 *     summary: Update driver information
 *     tags: [Driver]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverId:
 *                 type: string
 *               drivername:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               experience:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful update
 *         content:
 *           application/json:
 *             example:
 *               message: Driver updated successfully
 *               driver: {}
 *       '400':
 *         description: Update failure
 *         content:
 *           application/json:
 *             example:
 *               message: Update failure
 */

/**
 * @swagger
 * /driver/delete/{id}:
 *   delete:
 *     summary: Delete a driver
 *     tags: [Driver]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     responses:
 *       '200':
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             example:
 *               message: Driver deleted successfully
 *               driver: {}
 *       '400':
 *         description: Delete failure
 *         content:
 *           application/json:
 *             example:
 *               message: Delete failure
 */

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
      totalPages: totalPages,
    });

    console.log(drivers);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

function broadcastNewRideRequest(rideRequest, drivers) {
  drivers.forEach((driverWs) => {
    if (driverWs.readyState === WebSocket.OPEN) {
      driverWs.send(
        JSON.stringify({ type: "newRideRequest", data: rideRequest })
      );
    }
  });
}

//register
driverroute.post("/register", async (req, res) => {
  const {
    image,
    username,
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
              image,
              username,
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
  const { username, password } = req.body;

  try {
    const driver = await DriverModel.findOne({ username });

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
          { username: driver.username, driverId: driver._id },
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

// update
// driverroute.patch("/update/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const updatedDriver = await DriverModel.findByIdAndUpdate(
//       id,
//       { $set: req.body },
//       { new: true }
//     );

//     if (updatedDriver) {
//       res.status(200).json({ message: "Driver updated successfully", driver: updatedDriver });
//     } else {
//       res.status(404).json({ message: "Driver not found" });
//     }
//   } catch (error) {
//     console.error("Update failure:", error);
//     res.status(400).json({ message: "Update failure", error });
//   }
// });

//update
driverroute.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  try {
    if (payload.driverId === req.body.driverId) {
      const updatedDriver = await DriverModel.findByIdAndUpdate(
        { _id: id },
        payload
      );
      res
        .status(200)
        .json({
          message: "Driver updated successfully",
          driver: updatedDriver,
        });
    } else {
      res.status(404).json({ message: "Driver not found" });
    }
  } catch (error) {
    console.error("Update failure:", error);
    res.status(400).json({ message: "Update failure", error });
  }
});

// delete
driverroute.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDriver = await DriverModel.findByIdAndDelete(id);

    if (deletedDriver) {
      res
        .status(200)
        .json({
          message: "Driver deleted successfully",
          driver: deletedDriver,
        });
    } else {
      res.status(404).json({ message: "Driver not found" });
    }
  } catch (error) {
    console.error("Delete failure:", error);
    res.status(400).json({ message: "Delete failure", error });
  }
});

module.exports = {
  driverroute,
  broadcastNewRideRequest,
};
