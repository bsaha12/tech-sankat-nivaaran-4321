const express = require("express");
const { connection } = require("./db");
const { carDataRouter } = require("./routes/carData.route");
const { userRouter } = require("./routes/user.route");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

// swagger UI
// my requirements
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RiderX APIs",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
// building OpenApi Specifications
const openApiSpec = swaggerJsDoc(options);

//Building complete UI
app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

// routes
app.use("/carData", carDataRouter);
app.use("/users", userRouter);

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
