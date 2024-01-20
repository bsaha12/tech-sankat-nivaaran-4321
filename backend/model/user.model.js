const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
        image:{
                type: String,
        },
        username: {
                type: String,
                require: true
        },
        email: {
                type: String,
                require: true
        },
        password: {
                type: String,
                required: true,
        },
        role: {
                type: String,
                default : "user",
                enum: ["admin", "user", "super Admin"]
        }
}, {
        versionKey: false,
});

const UserModel = mongoose.model("user", userSchema);

module.exports = {
        UserModel
};