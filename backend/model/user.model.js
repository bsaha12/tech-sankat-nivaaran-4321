const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    image: {
      type: String,
    },
    name: {
      type: String,
    },
    username: {
      type: String,
      require: true,
      immutable: true,
    },
    email: {
      type: String,
      require: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
    },
    birthday: {
      type: Date,

    },
    designation:{
        type:String
    },
    role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
      immutable: true,
    },
    registeredDate: {
      type: Date,
      default: Date.now,
//       immutable: true,
    },
   
    bio: String,
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
