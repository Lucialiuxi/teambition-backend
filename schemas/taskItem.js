// 任务列表 taskItem
let mongoose = require('mongoose');

var Schema = mongoose.Schema;

//任务列表结构
module.exports = new Schema({
    userLoginName:String,//用户的登录名
    fileId: Number,//项目文件id
    taskItemId: Number,//任务列表id
    taskItemName: String,//任务列表名
    subTaskCount: Number,//子任务数量
    index:Number //按照 未完成-进行中-已完成 排序
});