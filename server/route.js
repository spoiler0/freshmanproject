const user = require("./models/User").user;
const createJWT = require("./utils/createJWT");
const decodeJWT = require("./utils/decodeJWT");

const route = (app, mongoose) => {
  const User = user(mongoose);

  app.get("/", async (req, res) => {
    res.send("Home");
  });

  // fetch("http://localhost:8000/signup", {headers: {"Content-Type": "application/json"},method: "post", body: JSON.stringify({uid: "jihun", password: "jihun", name: "jihun"})})
  app.post("/signup", async (req, res) => {
    const {
      body: { uid, password, name }
    } = req;
    const foundUser = await User.findOne({
      uid
    });
    if (foundUser) {
      res.status(200).json({
        error: "You should use another ID!"
      });
    } else {
      new User({
        uid,
        password,
        name
      }).save();
      res.status(200).json({
        error: null
      });
    }
  });

  // fetch("http://localhost:8000/login", {headers: {"Content-Type": "application/json"},method: "post", body: JSON.stringify({uid: "jihun", password: "jihun"})}).then(res => res.json()).then(json => console.log(json))
  app.post("/signin", async (req, res) => {
    const {
      body: { uid, password }
    } = req;
    const user = await User.findOne({
      uid
    });
    if (user) {
      if (user.password == password) {
        const token = createJWT(user.id);
        res.status(200).json({
          error: null,
          token
        });
      } else {
        res.status(401).json({
          error: "Password is wrong!",
          token: null
        });
      }
    } else {
      res.status(404).json({
        error: "User not found!",
        token: null
      });
    }
    console.log(user);
  });

  // fetch("http://localhost:8000/myinfo", {method: "post", headers: {"Content-Type": "application/json"}, body: JSON.stringify({token: localStorage.getItem('token')})}).then(res => res.json()).then(json => console.log(json))
  app.post("/myinfo", async (req, res) => {
    const {
      body: { token }
    } = req;
    console.log(token);
    const _id = await decodeJWT(token);
    console.log(_id);
    const user = await User.findOne({
      _id
    });
    console.log(user);
    if (user) {
      res.status(200).json({
        error: null,
        user
      });
    } else {
      res.status(404).json({
        error: "User not found!",
        user: null
      });
    }
  });
};

module.exports = {
  route: route
};
