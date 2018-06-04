// 任务列表 taskItem
let mongoose = require('mongoose');

var Schema = mongoose.Schema;

//任务列表结构
module.exports = new Schema({
    loginName:String,//用户的登录名
    fileId: Number,//项目文件id
    taskItemId: Number,//任务列表id
    taskItemName: String,//任务列表名
    subTaskCount: Number//子任务数量
});