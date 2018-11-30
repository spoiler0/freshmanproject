const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/public/views");

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

const server = app.listen(8000, () => {
  console.log("server is running at 8000");
});
