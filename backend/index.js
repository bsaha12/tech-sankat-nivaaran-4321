const express = require("express");
const { connection } = require("./db");
const {driverroute}=require("./routes/driver.routes")

const app = express();
app.use(express.json());

app.use("/driver",driverroute);


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
