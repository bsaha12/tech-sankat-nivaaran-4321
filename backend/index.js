const express = require("express");
const { connection } = require("./db");
const { cardataRouter } = require("./routes/cartata.route");
const app = express();

app.use(express.json())

const cors = require("cors")
app.use(cors())
const cors = require("cors");
const { userRouter } = require("./routes/user.route");
carDataRouter.use(cors())

app.use("/carData", cardataRouter)
// connecting to server and DB
app.listen(8080, async () => {
  try {
    await connection;
    console.log("Connected to DB");
    console.log("Server Started");
  } catch (error) {
    console.log(error);
  }
});
