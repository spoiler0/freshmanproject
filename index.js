const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const route = require("./server/route").route;
// const userSetup = require("./server/models/User").user;

const app = express();

app.use(express.static('./client/views'));

app.set("view engine", "ejs");
app.set("views", __dirname + "/client/views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine("html", require("ejs").renderFile);

const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log("DB is well connected");
});

mongoose.connect(
  "mongodb://localhost/test",
  { useNewUrlParser: true }
);

//
// userSetup(mongoose);

route(app, mongoose);

const server = app.listen(8000, () => {
  console.log("server is running at 8000");
});
