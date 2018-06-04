//创建模型
let mongoose = require('mongoose');

let usersSchema = require('../schemas/taskItem.js');

///用户表结构taskItems  创建模型  取名TaskItem
module.exports = mongoose.model('TaskItem',usersSchema,'taskItems');