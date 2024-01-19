const mongoose = require("mongoose");

const driverSchema = mongoose.Schema({
  drivername: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  experience: { type: Number },
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
  },
  registeredDate: {
    type: Date,
    default: Date.now, 
  },
}, {
  versionKey: false
});

const DriverModel = mongoose.model("Driver", driverSchema);

module.exports = {
  DriverModel,
};
