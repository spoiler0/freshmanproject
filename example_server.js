const express = require("express");

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/client/views");
app.use(express.static('clinet/views'));
app.engine('html', require('ejs').renderFile);





app.get("/", (req, res) => {
    res.render('home.html');
})

const server = app.listen(8000, () => {
  console.log("server is running at 8000");
});