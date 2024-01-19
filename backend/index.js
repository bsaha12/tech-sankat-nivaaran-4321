const express = require("express");
const { connection } = require("./db");
const {driverroute}=require("./routes/driver.routes")
const { cardataRouter } = require("./routes/cartata.route");
const swaggerJsDoc=require("swagger-jsdoc");
const swaggerUi=require("swagger-ui-express")

const app = express();

app.use(express.json())

const cors = require("cors");
app.use(cors())
const options={
  definition:{
    openapi:"2.0.0",
    info:{
      title:"CAB BOOKING",
      version:"1.0.0"
    },
    servers:[
      {
        url:"http://localhost:8080"
      }
    ]
  },
  apis:["./routes/*.js"]
}
const openapispec=swaggerJsDoc(options)
app.use("/documentation",swaggerUi.serve,swaggerUi.setup(openapispec))

// module.exports=swaggerJsDoc(options);

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
