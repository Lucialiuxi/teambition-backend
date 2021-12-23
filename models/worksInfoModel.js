//创建模型
let mongoose = require('mongoose');

let usersSchema = require('../schemas/works.js');

//用户表结构Works  创建模型  取名Works
module.exports = mongoose.model('Works',usersSchema,'works');