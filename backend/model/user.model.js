const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    image: {
      type: String,
    },
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user", "super Admin"],
    },
    name: String,
    bio: String,
    birthday: String,
    phone: String,
    website: String,
  },

  {
    versionKey: false,
  }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = {
  UserModel,
};
