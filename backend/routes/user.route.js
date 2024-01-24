const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const { UserModel } = require("../model/user.model");
const { blacklistModel } = require("../model/blacklist");
const { RideRequestModel } = require("../model/riderequest.model");
const {
  extractUserMiddleware,
} = require("../middlewares/extract.User.Middleware");
const { checkAdminRole } = require("../middlewares/checkAdminRole.middlewear");
const {
  authenticateToken,
} = require("../middlewares/authentication.middlwear");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, "profile-" + Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

// Update user profile route with image upload
/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: profileImage
 *         type: file
 *         description: The profile image file (optional)
 *       - in: formData
 *         name: newadminname
 *         type: string
 *         description: The new admin name
 *       - in: formData
 *         name: newEmail
 *         type: string
 *         description: The new email
 *       - in: formData
 *         name: newPhone
 *         type: string
 *         description: The new phone number
 *       - in: formData
 *         name: newDesignation
 *         type: string
 *         description: The new designation
 *       - in: formData
 *         name: newdateofBirth
 *         type: string
 *         description: The new date of birth
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *
 *   get:
 *     summary: Get own user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
userRouter.put(
  "/profile1",
  authenticateToken,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const {
        newadminname,
        // newEmail,
        newPhone,
        newDesignation,
        newdateofBirth,
      } = req.body;

      const imageUrl = req.file ? req.file.path : null;

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            name: newadminname,
            // email: newEmail,
            phone: newPhone,
            designation: newDesignation,
            image: imageUrl.replace(/\\/g, "/"),
            birthday: newdateofBirth,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }
);

// get own profile
userRouter.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /users/admin:
 *   get:
 *     summary: Get list of admin users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         type: integer
 *         description: Page number (optional)
 *       - in: query
 *         name: limit
 *         type: integer
 *         description: Number of items per page (optional)
 *     responses:
 *       200:
 *         description: List of admin users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users_data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/User"
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Items per page
 *                 totalAdmin:
 *                   type: integer
 *                   description: Total number of admin users
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
userRouter.get(
  "/admin",
  extractUserMiddleware,
  checkAdminRole,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const skip = (page - 1) * limit;
      const users = await UserModel.find({
        role: { $in: ["admin", "super-admin"] },
      })
        .skip(skip)
        .limit(limit);

      const totaladmin = await UserModel.countDocuments({
        role: { $in: ["admin", "super-admin"] },
      });

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
  }
);

/**
 * @swagger
 * /users/riders:
 *   get:
 *     summary: Get list of user riders
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         type: integer
 *         description: Page number (optional)
 *       - in: query
 *         name: limit
 *         type: integer
 *         description: Number of items per page (optional)
 *     responses:
 *       200:
 *         description: List of user riders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users_data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/User"
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Items per page
 *                 totalusers:
 *                   type: integer
 *                   description: Total number of user riders
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
userRouter.get(
  "/riders",
  extractUserMiddleware,
  checkAdminRole,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const skip = (page - 1) * limit;

      const users = await UserModel.find({ role: { $in: ["user"] } })
        .skip(skip)
        .limit(limit);

      const totalusers = await UserModel.countDocuments({
        role: { $in: ["user"] },
      });

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
  }
);

//registration
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The new user has been registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Confirmation message
 *       400:
 *         description: Bad request. Check the request payload.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
userRouter.post("/register", async (req, res) => {
  const {
    image,
    name,
    username,
    email,
    password,
    number,
    birthday,
    designation,
    role,
  } = req.body;
  console.log(req.body);
  try {
    const user = await UserModel.find({ email: email, username: username });
    console.log(user);
    if (user.length > 0) {
      return res.status(400).json({ msg: "User is already existed" });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.status(200).json({ error: err });
      } else {
        const user = await new UserModel({
          image,
          name,
          username,
          email,
          password: hash,
          number,
          birthday,
          designation,
          role,
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
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Confirmation message
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Bad request. Check the request payload.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    const role = user.role;
    const image = user.image;
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { userId: user._id, name: user.name },
            "masai",
            { expiresIn: "7d" }
          );
          // localStorage.setItem("role",user.role)
          // localStorage.setItem("image"=user.image)
          res
            .status(200)
            .json({ msg: "Logged in successfully", token, role, image });
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
/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Log out a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User has been logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Confirmation message
 *       400:
 *         description: Bad request. Check the request headers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
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
/**
 * @swagger
 * /users/requestRide:
 *   post:
 *     summary: Store ride request in the database
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               username:
 *                 type: string
 *               startLocation:
 *                 type: string
 *               destinationLocation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ride request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
userRouter.post("/requestRide", async (req, res) => {
  const { userId, username, startLocation, destinationLocation } = req.body;
  try {
    const newRideRequest = new RideRequestModel({
      username,
      startLocation: startLocation,
      destinationLocation: destinationLocation,
    });
    await newRideRequest.save();

    res.status(200).json({ message: "Ride request sent successfully" });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
});

/**
 * @swagger
 * /users/update/{id}:
 *   patch:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The updated username
 *               email:
 *                 type: string
 *                 description: The updated email
 *               role:
 *                 type: string
 *                 description: The updated role
 *               image:
 *                 type: string
 *                 description: The updated image URL
 *               adminname:
 *                 type: string
 *                 description: The updated admin name
 *               dateofBirth:
 *                 type: string
 *                 description: The updated date of birth
 *               designation:
 *                 type: string
 *                 description: The updated designation
 *               phoneNumber:
 *                 type: string
 *                 description: The updated phone number
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the updated user
 *                     username:
 *                       type: string
 *                       description: The updated username
 *                     email:
 *                       type: string
 *                       description: The updated email
 *                     role:
 *                       type: string
 *                       description: The updated role
 *                     image:
 *                       type: string
 *                       description: The updated image URL
 *                     adminname:
 *                       type: string
 *                       description: The updated admin name
 *                     dateofBirth:
 *                       type: string
 *                       description: The updated date of birth
 *                     designation:
 *                       type: string
 *                       description: The updated designation
 *                     phoneNumber:
 *                       type: string
 *                       description: The updated phone number
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       400:
 *         description: Update failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

userRouter.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  try {
    if (payload.userId === req.body.userId) {
      const updateduser = await UserModel.findByIdAndUpdate(
        { _id: id },
        payload
      );
      res
        .status(200)
        .json({ message: "user updated successfully", user: updateduser });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.error("Update failure:", error);
    res.status(400).json({ message: "Update failure", error });
  }
});

// delete
/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the deleted user
 *                     username:
 *                       type: string
 *                       description: The deleted username
 *                     email:
 *                       type: string
 *                       description: The deleted email
 *                     role:
 *                       type: string
 *                       description: The deleted role
 *                     image:
 *                       type: string
 *                       description: The deleted image URL
 *                     adminname:
 *                       type: string
 *                       description: The deleted admin name
 *                     dateofBirth:
 *                       type: string
 *                       description: The deleted date of birth
 *                     designation:
 *                       type: string
 *                       description: The deleted designation
 *                     phoneNumber:
 *                       type: string
 *                       description: The deleted phone number
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       400:
 *         description: Delete failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
userRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteuser = await UserModel.findByIdAndDelete(id);

    if (deleteuser) {
      res
        .status(200)
        .json({ message: "user deleted successfully", user: deleteuser });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.error("Delete failure:", error);
    res.status(400).json({ message: "Delete failure", error });
  }
});

//get rides

//get rides
/**
 * @swagger
 * /users/rides:
 *   get:
 *     summary: Get all ride requests
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of ride requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rideRequests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the ride request
 *                       startLocation:
 *                         type: string
 *                         description: The starting location for the ride request
 *                       destinationLocation:
 *                         type: string
 *                         description: The destination location for the ride request
 *                       status:
 *                         type: string
 *                         description: The status of the ride request
 *                       username:
 *                         type: string
 *                         description: The username associated with the ride request
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
userRouter.get("/rides", async (req, res) => {
  try {
    const rideRequests = await RideRequestModel.find();
    res.status(200).json({ rideRequests });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// get specific user by username
/**
 * @swagger
 * /users/profile/{username}:
 *   get:
 *     summary: Get specific user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The user's ID
 *                 username:
 *                   type: string
 *                   description: The user's username
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                 role:
 *                   type: string
 *                   description: The user's role
 *                 image:
 *                   type: string
 *                   description: The user's image URL
 *                 adminname:
 *                   type: string
 *                   description: The user's admin name
 *                 dateOfBirth:
 *                   type: string
 *                   format: date
 *                   description: The user's date of birth
 *                 designation:
 *                   type: string
 *                   description: The user's designation
 *                 phoneNumber:
 *                   type: string
 *                   description: The user's phone number
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
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
/**
 * @swagger
 * /users/updateprofile/{username}:
 *   patch:
 *     summary: Update profile of a specific user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name
 *               bio:
 *                 type: string
 *                 description: The updated bio
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: The updated date of birth
 *               phone:
 *                 type: string
 *                 description: The updated phone number
 *               website:
 *                 type: string
 *                 description: The updated website URL
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Confirmation message
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
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
