//创建模型
let mongoose = require('mongoose');

let usersSchema = require('../schemas/users.js');

//用户表结构users  创建模型  取名User
module.exports = mongoose.model('User',usersSchema,'users');

