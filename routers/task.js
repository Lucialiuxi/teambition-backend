//任务列表信息
let TaskItem = require('../models/taskItemModel');
let SubTask = require('../models/subTaskModel');
let express = require('express');
const { v4: uuidv4 } = require('uuid');


var router = express.Router();

//解析post请求主体的键值对
const bodyParser = require('body-parser');

// 解析post请求中的xhr.setRequestHeader( 'Content-Type','application/x-www-form-urlencoded')
router.use(bodyParser.urlencoded({ extended: true }))
//parse application/json
router.use(bodyParser.json())

/***
 * code:
 *      注册：
 *          0 注册的用户名已经存在
 *          1 注册成功
 *      登录：
 *          404 用户名不存在、密码错误
 *          200  登录成功
 *      新建项目文件夹：
 *          200  新建项目成功
 *      刷新：
 *          3 刷新获取数据成功
 *      
 */
// 新建任务列表
router.post('/CreateTaskItem',function(req,res,next){
    let fileId = req.body.param.fileId;
    let userLoginName = req.body.param.userLoginName;
    let defaultTaskItem = req.body.arr;
    // console.log(defaultTaskItem[0])
    if(fileId){
        TaskItem.find({
            userLoginName:userLoginName,
            fileId:fileId
        },function(err,adventure){
            // console.log(err,'adventure',adventure,adventure[0])
            if(err){
                // console.log('err',err)
                return;
            }
            if(!adventure[0]){
                // console.log('创建',adventure)
                TaskItem.create(defaultTaskItem[0],defaultTaskItem[1],defaultTaskItem[2],function(error,d){
                    // console.log(error,d)
                    if(error){
                        // console.log('error',error)
                    }
                    res.json({
                        success:true,
                        code:33,
                        message:'创建默认的任务列表',
                        CurrentTaskItemInfo:defaultTaskItem
                    })
                })
            }
        })
    }
})

//查询一个项目文件下的任务列表 和任务列表下 子任务
router.post('/GetTaskItemAndSubTask',function(req,res,next){
    // console.log('查询一个项目文件下的任务列表')
    let fileId = req.body.fileId;
    if(fileId){
        TaskItem.find({
            fileId:fileId
        },function(err,data){
            // console.log(err,data)
            if(err){
                // console.log('err',err)
            }else if(data[0]){
                res.json({
                    success:true,
                    code:33,
                    message:`查询fileId--${fileId}对应的任务列表`,
                    CurrentTaskItemInfo:data
                })
            }
        })
    }
})

//查询一个项目文件下的任务列表
router.post('/GetTaskItem',function(req,res,next){
    // console.log('查询一个项目文件下的任务列表')
    let fileId = req.body.fileId;
    if(fileId){
        TaskItem.find({
            fileId:fileId
        },function(err,data){
            // console.log(err,data)
            if(err){
                // console.log('err',err)
            }else if(data){
                res.json({
                    success:true,
                    code:33,
                    message:`查询fileId--${fileId}对应的任务列表`,
                    CurrentTaskItemInfo:data
                })
            }
        })
    }
})

//查询所有当前项目文件的任务列表的任务
router.post('/GetAllSubTasks',function(req,res,next){
    // console.log('查询一个项目文件下的任务列表')
    let fileId = req.body.fileId;
    if(fileId){
        SubTask.find({
            fileId
        },function(err,data){
            // console.log(err,data)
            if(err){
                // console.log('err',err)
            }else if(data){
                res.json({
                    success:true,
                    code:33,
                    message:`查询fileId--${fileId}对应的任务列表`,
                    subTasksData:data
                })
            }
        })
    }
})

/**新建一个子任务
 * 
 * @param {
 * checked:false , 
 * deadline:String,
 * fileId:Number,
 * index:Number,
 * taskItemId:Number
 * subTaskName:String,
 * subTaskId:String,
 * tag:Array,
 * urgencyLevel:String
 * }
 */
router.post('/CreateASubTask',function(req,res,next){
    let taskItemId = req.body.taskItemId;
    let newSubTask = {
        ...req.body,
        subTaskId: uuidv4(),
    };

    if(taskItemId){
        TaskItem.find({
            taskItemId
        },function(err,adventure){
            if(err){
                return;
            }
            SubTask.create(newSubTask,function(error,d){
                // console.log(error,d)
                if(error){
                    // console.log('error',error)
                }
                res.json({
                    success:true,
                    code:33,
                    message:'创建默认的任务列表',
                    newSubTaskInfo:req.body
                })
            });
        })
    }
})

/**选中一个任务
 * @param { taskItemId:Number, subTaskId:Number, checked:Boolean } param 
 */

 router.post('/SwitchToCheckSubtask',function(req,res,next){
    let subTaskId = req.body.subTaskId;
    if(subTaskId){
        SubTask.updateOne({
            subTaskId
        }, { 
            $set: { checked: req.body.checked },
         }, function(err, adventure){
            if(err){
                return;
            }
            if (adventure.nModified) {
                SubTask.find({ subTaskId },function(err, docs) {
                    if(err){
                        console.error(err);
                    }else{
                        res.json({
                            success:true,
                            code:33,
                            message:'操作成功',
                            data: docs[0]
                        });
                    }
                });

            } else {
                res.json({
                    success:false,
                    code:33,
                    message:'操作失败',
                    data: {},
                });
            }
        })
    }
})

module.exports = router;
