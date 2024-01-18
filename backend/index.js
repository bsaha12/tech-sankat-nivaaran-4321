const express = require("express");
const { connection } = require("./db");
const {driverroute}=require("./routes/driver.routes")
const { cardataRouter } = require("./routes/cartata.route");

const app = express();

app.use(express.json())

const cors = require("cors");
app.use(cors())

app.use("/driver",driverroute);
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
