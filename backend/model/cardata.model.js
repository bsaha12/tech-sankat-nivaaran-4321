const { mongoose } = require("mongoose");
const cardataSchema = mongoose.Schema(
  {
    image: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    reason: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    registeredDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const cardataModel = mongoose.model("car", cardataSchema);

module.exports = {
  cardataModel,
};
