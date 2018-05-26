//创建模型
let mongoose = require('mongoose');

let FileInfo = require('../schemas/fileItemInfo.js');

///用户表结构是FilesInfo 创建模型model取名FileInfo
module.exports = mongoose.model('FileInfo',FileInfo,'FilesInfo');