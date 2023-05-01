const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-Type", "text/html");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, X-Requested-With"
  );
  next();
});

var routes = require("./Routers/route");
var mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/EMS", (err, con) => {
  if (!err) {
    console.log("Db Connected Successfully..");
  }
});

app.use("/api", routes);

app.listen(8080, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}.`);
});
