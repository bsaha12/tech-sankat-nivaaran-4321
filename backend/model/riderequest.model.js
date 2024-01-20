const mongoose = require("mongoose");

const rideRequestSchema = mongoose.Schema({
  username: { type: String, ref: "User", required: true },
  startLocation: { type: String, required: true },
  destinationLocation: { type: String, required: true },
  status: { type: String, default: "pending" },
},{
  versionKey : false
});

const RideRequestModel = mongoose.model("RideRequest", rideRequestSchema);

module.exports = {
  RideRequestModel,
};
