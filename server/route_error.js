const user = require("./models/User").user;
const express = require('express');
const Board = require('./models/Boards');
const createJWT = require("./utils/createJWT");
const decodeJWT = require("./utils/decodeJWT");
const router = express.Router();

router.get('/main', function(req, res, next) {
  Board.find({}, function(err, board) {
    res.render('index', {title: 'Express', board: board})
  });
});

router.get('/write', function(req, res, next) {
  res.render('wreite', {title: '글쓰기'});
});

router.post('/board/write', function(req, res, next) {
  var board = new Board(); 
  board.title = req.body.title;
  board.contents = req.body.contents;
  board.author = req.body.author;

  board.save(function(err) {
    if (err) {
      console.log(err);
      res.redirect('/main');
    }
    res.redirect('/main');
  });
});

router.post('/board/:id', function(req, res) {
  Board.findOne({_id: req.params.id}, function(err, board) {
    res.render('board', {title: 'Board', board: board});
  });
});


router.post('/comment/wrtie', function(req, res) {
  var comment = new Comment();
  comment.contents = req.body.contents;
  comment.author = req.body.author;

  board.findOneAndUpdate({_id: req.body.id}, {$push: {comments: comment}}, function (err, board) {
    if (err) {
      console.log(err);
      res.redirect('/main');
    }
    res.redirect('/board/' + req.body.id);
  });
});


router.get("/", async (req, res) => {
  res.render('home.html');
});

router.get("/to_signup", (req, res) => {
  res.render('signup.html');
})

// fetch("http://localhost:8000/signup", {headers: {"Content-Type": "application/json"},method: "post", body: JSON.stringify({uid: "jihun", password: "jihun", name: "jihun"})})
router.post("/signup", async (req, res) => {
  const {
    body: { name, uid, password, passwordcheck }
  } = req;
  const foundUser = await User.findOne({
    uid
  });
  if (foundUser) {
    res.status(200).json({
      error: "You should use another ID!"
    });
  } else {
    if (password != passwordcheck) {
      res.status(200).json({
        error: "The passwords are not equal!"
      })
    } else {
        new User({
          name,
          uid,
          password
        }).save();
        res.status(200).json({
          error: null
        });
    }
  }
});

// fetch("http://localhost:8000/login", {headers: {"Content-Type": "application/json"},method: "post", body: JSON.stringify({uid: "jihun", password: "jihun"})}).then(res => res.json()).then(json => console.log(json))
router.post("/signin", async (req, res) => {
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
router.post("/myinfo", async (req, res) => {
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

module.exports = router;
