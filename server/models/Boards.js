/*
var mongooseSetup = mongoose => {
    var Schema = mongoose.Schema;
    var userSchema = new Schema({
        writer: String,
        password: String,
        title: String,
        contents: String,
        comments: [{
            name: String,
            memo: String,
            date: {type: Date, default: Date.now}
        }],
        count: {type: Number, default: 0},
        date: {type: Date, default: Date.now},
        updated: [{contents: String, date:{type: Date, default: Date.now}}],
        deleted: {type: Boolean, default: false}
    });
    return mongoose.model("user", userSchema);
    };
  
    module.exports = {
        user: mongooseSetup
  };
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    contents: String,
    author: String,
    date: {type: Date, default: Date.now()}
});

var boardSchema = new Schema({
    title: String,
    author: String,
    contents: String,
    file: String,
    comments: [commentSchema],
    count: {type: Number, default: 0},
    date: {type: Date, default: Date.now},
    updated: [{contents: String, date:{type: Date, default: Date.now}}],
    deleted: {type: Boolean, default: false}
});

module.exports =  mongoose.model('board', boardSchema);