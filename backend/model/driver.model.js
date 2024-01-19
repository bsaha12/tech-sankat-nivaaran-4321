const mongoose = require("mongoose");

const driverSchema = mongoose.Schema(
  {
    drivername: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    experience: { type: Number },
    latitude: { type: Number },
    longitude: { type: Number },
    registerDate: {
      type: String,
      default: () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = currentDate.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      },
    },
    phoneNumber: {
      type: Number,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
    },
  },
  {
    versionKey: false,
  }
);

const DriverModel = mongoose.model("Driver", driverSchema);

module.exports = {
  DriverModel,
};
