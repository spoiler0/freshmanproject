const express = require('express');
const router = express.Router();
const BoardContents = require('./models/Boards');


router.get('/', function(req, res) {
    // 처음에 나오는 부분 <- DB에서 게시글 리스트 가져와서 출력

    BoardContents.find({}).sort({date:-1}).exec(function(err, rawContents) {
        if (err) throw err;

        res.render('board', {title:"Board", contents: rawContents});
    });
});

module.exports = router;