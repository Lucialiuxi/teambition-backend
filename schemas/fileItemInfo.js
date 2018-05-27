//规则
let mongoose = require('mongoose');

var Schema = mongoose.Schema;


//每个用户对应的大图标文件区
module.exports = new Schema({
    userLoginName:String,
    FileName:  String,
    FileAbstract: String,
    fileId: Number,
    star: Boolean,
    inRecycleBin: Boolean
  });