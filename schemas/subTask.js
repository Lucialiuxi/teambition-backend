// 任务列表 subTask
let mongoose = require('mongoose');

var Schema = mongoose.Schema;

//任务列表结构
module.exports = new Schema({
    fileId: Number, //项目文件id
    taskItemId: Number, //任务列表id
    subTaskId: String,//子任务id
    index:Number, //按照 未完成-进行中-已完成 排序
    subTaskName: String, //子任务名称
    tag: Array, // 标签
    urgencyLevel: String, //紧急程度：普通normal  紧急urgency  非常紧急emtreme urgency
    deadline: String, //任务截止时间
    checked: Boolean,
});