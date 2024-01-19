const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/user.model");
const { blacklistModel } = require("../model/blacklist");
const { access } = require("../middleware/access.middleware");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

//get data
userRouter.get("/data", access(["admin"]), async (req, res) => {
        try {
                const users = await UserModel.find();
                res.status(200).json({ users: users });
                console.log(users);
        } catch (err) {
                res.status(500).json({ error: "Internal server error" });
        }
});
//registration
userRouter.post("/register", async (req, res) => {
        const { username, email, password } = req.body;
        try {
                const user = await UserModel.findOne({ $or: [{ email }, { username }] });
                console.log(user);
                if (user) {
                        return res.status(400).json({ msg: "User is alreday existed" });
                }
                bcrypt.hash(password, 5, async (err, hash) => {
                        if (err) {
                                res.status(200).json({ error: err });
                        } else {
                                const user = await new UserModel({
                                        username, email, password: hash
                                });
                                await user.save();
                                console.log(user);
                                res.status(200).json({
                                        msg: "The new user has been registered"
                                });
                        }
                });
        } catch (err) {
                res.status(400).json({ error: err })
        }
})
//login
userRouter.post("/login", async (req, res) => {
        const { email, password } = req.body;
        try {
                const user = await UserModel.findOne({ email });
                if (user) {
                        bcrypt.compare(password, user.password, (err, result) => {
                                if (result) {
                                        const token = jwt.sign({ userId: user._id, name: user.name }, "masai", { expiresIn: "7d" });
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
module.exports = {
        userRouter
}