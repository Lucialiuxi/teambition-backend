//规则
let mongoose = require('mongoose');

var Schema = mongoose.Schema;

//用户表结构
module.exports = new Schema({
  username:  String,
  password: String,
});