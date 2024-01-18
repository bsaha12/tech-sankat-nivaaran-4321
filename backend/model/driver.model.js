const mongoose = require("mongoose");

const driverSchema = mongoose.Schema({
  DriverName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  experience: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  phoneNumber: {
    type: Number,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    },
    required: true
  }
}, {
  versionKey: true
});

const DriverModel = mongoose.model("Driver", driverSchema);

module.exports = {
  DriverModel,
};
