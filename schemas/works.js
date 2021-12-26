//规则
let mongoose = require('mongoose');

let Schema = mongoose.Schema;


//每个用户对应的大图标文件区
module.exports = new Schema({
    username: String,
    fileId: Number,
    parentId: String,
    myId: String,
    workFileName: String,
    lastestModifyTime: String,
    worksViewType: String, // 'ThumbnailView' | 'ListView',
    check: Boolean,
  });