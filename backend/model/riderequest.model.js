const mongoose = require("mongoose");

const rideRequestSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startLocation: { type: String, required: true },
  destinationLocation: { type: String, required: true },
  status: { type: String, default: "pending" }, // You can add more status options
  // Other fields as needed
});

const RideRequestModel = mongoose.model("RideRequest", rideRequestSchema);

module.exports = {
  RideRequestModel,
};
