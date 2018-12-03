const user = require("./models/User").user;
const Board = require('./models/Boards');
const Comment = require('./models/Comment');
const createJWT = require("./utils/createJWT");
const decodeJWT = require("./utils/decodeJWT");
const express = require('express');
const router = express.Router();
const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },

  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage });


/*
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
      res.redirect('/main');
    }
    res.redirect('/board/' + req.body.id);
  });
});
*/


const route = (app, mongoose, router) => {
  const User = user(mongoose);
  
  // app.use(express.static(__dirname + '/public'));
  
  app.get("/board2", (req, res) => {
    res.render("board2.ejs");
  })
  
  
  // 게시판 만들기
  app.get('/main', function(req, res, next) {
    Board.find({}, function(err, board) {
      console.log(board);
      res.render('index', {title:"Express", board: board})
    });
  });

  app.get('/write', function(req, res, next) {
    User.find({}, function (err, user) {
      console.log(user);
      res.render('write', {user: user})
    });
  });

  app.post('/upload', upload.single('userfile'), function(req, res) {
    var board = new Board(); 
    board.title = req.body.title;
    board.contents = req.body.contents;
    board.author = req.body.author;
    if (req.file){
      board.file = req.file.originalname;
    }
    
    

    board.save(function(err) {
      if (err) {
        res.redirect('/main');
      }
      res.redirect('/main');
    });
  });

  app.post('/board/write', function(req, res, next) {
    var board = new Board(); 
    board.title = req.body.title;
    board.contents = req.body.contents;
    board.author = req.body.author;
    

    board.save(function(err) {
      if (err) {
        res.redirect('/main');
      }
      res.redirect('/main');
    });
  });
  
  app.get('/board/:id', function(req, res) {
    Board.findOne({_id: req.params.id}, function(err, board) {
      res.render('board', {title: 'Board', board: board});
    });
  });
  
  
  app.post('/comment/write', function(req, res) {
    var comment = new Comment();
    comment.contents = req.body.contents;
    comment.author = req.body.author;
  
    Board.findOneAndUpdate({_id: req.body.id}, {$push: {comments: comment}}, function (err, board) {
      if (err) {
        res.redirect('/main');
      }
      res.redirect('/board/' + req.body.id);
    });
  });

  // 파일 업로드
  app.use('/file', express.static('uploads'));

  // 로그인 관련
  app.get("/", async (req, res) => {
    res.render('home.ejs');
  });

  app.get("/to_signup", (req, res) => {
    res.render('signup.ejs');
  })

  app.get("/logout", (req, res) => {
    res.render('home.ejs');
  })

  app.get("/alert_id", (req, res) => {
    res.render("alert_id.ejs");
  })

  app.get("/alert_pw", (req, res) => {
    res.render("alert_pw.ejs");
  })

  app.get("/alert_wrongid", (req, res) => {
    res.render("alert_wrongid.ejs");
  })
  
  app.get("/alert_wrongpw", (req, res) => {
    res.render("alert_wrongpw.ejs");
  })

  app.post("/signup", async (req, res) => {
    const {
      body: { name, uid, password, passwordcheck }
    } = req;
    const foundUser = await User.findOne({
      uid
    });
    if (foundUser) {
      res.status(200).redirect("/alert_id")
      //  json({
      //    error: "You should use another ID!"
      //  });
    } else {
      if (password != passwordcheck) {
        res.status(200).redirect("/alert_pw")
        // json({
        //   error: "The passwords are not equal!"
        // })
      } else {
        new User({
          name,
          uid,
          password
        }).save();
        res.status(200).redirect("/");
      }
    }
  });

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
          ok: true,
          error: null,
          token
        });
      } else {
        res.status(401).json({
          ok: false,
           error: "Password is wrong!",
           token: null
         });
      }
    } else {
      res.status(404).json({
        ok: false,
         error: "User not found!",
         token: null
       });
    }
  });

  app.post("/myinfo", async (req, res) => {
    const {
      body: { token }
    } = req;
    const _id = await decodeJWT(token);
    const user = await User.findOne({
      _id
    });
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
