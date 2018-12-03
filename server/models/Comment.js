const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
    contents: String,
    author: String,
    date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('comment', commentSchema);