//创建模型
let mongoose = require('mongoose');

let usersSchema = require('../schemas/subTask.js');

///用户表结构subTask  创建模型  取名SubTask
module.exports = mongoose.model('SubTask',usersSchema,'subTask');