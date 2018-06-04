//注册的用户信息
let User = require('../models/userModel');
//项目文件信息
let FileInfo = require('../models/fileItemInfoModel');
//任务列表信息
let TaskItem = require('../models/taskItemModel');
let express = require('express');
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
//注册
router.post('/usersRegister',function(req,res,next){
    let un = req.body.username;
    let pw = req.body.password;
    let state = true;//判断是否可以注册
    console.log('注册')
    //先验证用户名是否存在
    User.findOne({
        username:un
    },function(err,adventure){
        // console.log('exec',err,adventure)
        if(err){//错误
            // console.log('err',err)
            return;
        }
        //返回给前端
        if(adventure){
            res.json({
                success:false,
                code:0,
                message:'用户名已存在'
            })
        }else{
            User.create({
                username:un,
                password:pw
            },function (err,data) {
                console.log(data)
                if(err){
                    return;
                }
                res.json({
                    success:true,
                    code:1,
                    message:'注册成功',
                    userInfo:data
                })
            });
        }
    })
})

//登录
router.post('/userLogin',function(req,res,next){
    let un = req.body.username;
    let pw = req.body.password;
    // console.log(un,pw)
    console.log('登录')
    User.findOne({
        username:un
    },function(err,adventure){
        console.log(err,adventure)
        if(err){
            return;
        }
        if(!adventure){
            res.json({
                success:false,
                code:404,
                message:'用户名不存在'
            })
        }else{
            User.findOne({
                username:un,
                password:pw
            },function(error,data){
                console.log(error,data)
                if(error){
                    return;
                }
                if(data){
                    res.json({
                        success:true,
                        code:200,
                        message:'登录成功',
                        userInfo:data
                    })
                }else{
                    res.json({
                        success:false,
                        code:404,
                        message:'密码错误'
                    })
                }
            })
        }
    })
})

//新建文件夹
router.post('/createFile',function(req,res,next){
    // console.log(req.body)
    console.log("新建文件夹")
    let userLoginName = req.body.userLoginName;
    let FileName = req.body.FileName;
    let FileAbstract = req.body.FileAbstract;
    let star = req.body.star;
    let fileId = req.body.fileId;
    let inRecycleBin = req.body.inRecycleBin;
    if(FileName){
        FileInfo.create({
            userLoginName:userLoginName,
            FileName:  FileName,
            FileAbstract: FileAbstract,
            fileId: fileId,
            star: star,
            inRecycleBin: inRecycleBin
        },function(err,data){
            // console.log(err,data)
            if(err){//错误
                console.log('err',err)
                return;
            }else{
                res.json({
                    success:true,
                    code:200,
                    message:'新建项目成功',
                    lastestFileInfoData:data
                })
            }

        }) 
    }

})

//进入或者刷新大图标文件区的时候，请求文件数据
router.post('/AllFilesInfo',function(req,res,next){
    // console.log(req.body)
    console.log("刷新")
    //前端发送过来的用户名存在，就查找用户名对应的数据
    let userName = req.body.userLoginName;
    if(userName){
        FileInfo.find({
            userLoginName:userName
        },function(err,data){
            // console.log(err,data)
            if(err){//错误
                console.log('err',err)
                throw new Error(err)
            }else{
                res.json({
                    success:true,
                    code:3,
                    message:'刷新获取数据成功',
                    AllFilesInfoData:data
                })
            }
        })
    }
    
})

//修改大图标文件的信息 
router.post('/ModifyFileInfo',function(req,res,next){
    // console.log('ModifyFileInfo',req.body)
    console.log('修改大图标文件')
    let fileId = req.body.fileId;
    let userLoginName = req.body.userLoginName;
    if(fileId){
        FileInfo.findOneAndUpdate({
            fileId: fileId,
            userLoginName: userLoginName,
        },{
            FileName:req.body.FileName,
            FileAbstract:req.body.FileAbstract
        },function(err,data){
            // console.log('findOneAndUpdate',err,data)
            if(err){
               console.log('err',err) 
            }
            if(data.fileId){
                res.json({
                    success:true,
                    code:5,
                    message:'修改文件信息成功',
                    afterModifyData:req.body
                })
            }
        })

    }
})

//切换标星
router.post('/ToggleFileStar',function(req,res,next){
    // console.log(req.body);
    console.log('切换标星')
    let fileId = req.body.fileId;
    let userLoginName = req.body.userLoginName;
    if(fileId){
        FileInfo.findOneAndUpdate({
            fileId: fileId,
            userLoginName: userLoginName,
        },{
            star:req.body.star
        },function(err,data){
            // console.log('findOneAndUpdate',err,data)
            if(err){
               console.log('err',err) 
            }
            if(data.fileId){
                res.json({
                    success:true,
                    code:5,
                    message:`切换标星成功${req.body.star}`,
                    afterModifyData:req.body
                })
            }
        })
    }
})

//移动文件到回收站
router.post('/MoveFileToRecycleBin',function(req,res,next){
    console.log('移动文件到回收站');
    let fileId = req.body.fileId;
    let userLoginName = req.body.userLoginName;
    if(fileId){
        FileInfo.findOneAndUpdate({
            fileId: fileId,
            userLoginName: userLoginName,
        },{
            inRecycleBin:req.body.inRecycleBin
        },function(err,data){
            // console.log('findOneAndUpdate',err,data)
            if(err){
               console.log('err',err) 
            }
            if(data.fileId){
                res.json({
                    success:true,
                    code:5,
                    message:'移动文件到回收站成功',
                    afterModifyData:req.body
                })
            }
        })
    }
})

//删除一个项目文件夹
router.post('/DeleteAFlie',function(req,res,next){
    console.log('删除回收站的文件夹');
    let fileId = req.body.fileId;
    let userLoginName = req.body.userLoginName;
    if(fileId){
        FileInfo.findOneAndDelete({
            fileId: fileId,
            userLoginName: userLoginName,
            inRecycleBin: true
        },function(err,data){
            if(err){
               console.log('err',err) 
            }
            if(data.fileId){
                res.json({
                    success:true,
                    code:5,
                    message:`文件删除成功`,
                    deletedFileInfo:data
                })
            }
        })
    }
})


// 新建任务列表
router.post('/CreateTaskItem',function(req,res,next){
    let fileId = req.body.param.fileId;
    let loginName = req.body.param.loginName;
    console.log(fileId,loginName)
    let defaultTaskItem = req.body.arr;
    if(fileId){
        TaskItem.find({
            loginName:loginName,
            fileId:fileId
        },function(err,adventure){
            console.log(err,'adventure',adventure,adventure[0])
            if(err){
                console.log('err',err)
                return;
            }
            if(adventure[0]){
                console.log('存在')
                TaskItem.find({
                    fileId:fileId
                },function(Error,d){
                    console.log(Error,d)
                    res.json({
                        success:true,
                        code:3,
                        message:'查找任务列表信息',
                        CurrentTaskItemInfo:adventure
                    })
                })
            }else{
                console.log('创建',adventure)
                TaskItem.create(defaultTaskItem[0],defaultTaskItem[1],defaultTaskItem[2],function(error,d){
                    console.log(error,d)
                    if(error){
                        console.log('error',error)
                    }
                    res.json({
                        success:true,
                        code:33,
                        message:'创建默认的任务列表',
                        CurrentTaskItemInfo:d
                    })
                })
            }
        })
    }
})
module.exports = router;
