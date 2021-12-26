//项目文件信息
let FileInfo = require('../models/fileItemInfoModel');
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

//新建文件夹
router.post('/createFile',function(req,res,next){
    // console.log(req.body)
    // console.log("新建文件夹")
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
                // console.log('err',err)
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

});

//进入或者刷新大图标文件区的时候，请求文件数据
router.post('/findAFileInfoServer',function(req,res,next){
    console.log("刷新")
    //前端发送过来的用户名存在，就查找用户名对应的数据
    let fileId = req.body.fileId;
    if(fileId){
        FileInfo.find({ fileId },function(err,data){
            // console.log(err,data)
            if(err){//错误
                // console.log('err',err)
                throw new Error(err)
            }else{
                res.json({
                    success:true,
                    code:3,
                    message:'刷新获取数据成功',
                    data,
                })
            }
        })
    }
    
});

//进入或者刷新大图标文件区的时候，请求文件数据
router.post('/AllFilesInfo',function(req,res,next){
    // console.log(req.body)
    // console.log("刷新")
    //前端发送过来的用户名存在，就查找用户名对应的数据
    let userName = req.body.userLoginName;
    if(userName){
        FileInfo.find({
            userLoginName:userName
        },function(err,data){
            // console.log(err,data)
            if(err){//错误
                // console.log('err',err)
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
    
});

//修改大图标文件的信息 
router.post('/ModifyFileInfo',function(req,res,next){
    // console.log('ModifyFileInfo',req.body)
    // console.log('修改大图标文件')
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
            if(err){
               // console.log('err',err) 
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
});

//切换标星
router.post('/ToggleFileStar',function(req,res,next){
    // console.log(req.body);
    // console.log('切换标星')
    let fileId = req.body.fileId;
    let userLoginName = req.body.userLoginName;
    if(fileId){
        FileInfo.findOneAndUpdate({
            fileId: fileId,
            userLoginName: userLoginName,
        },{
            star:req.body.star
        },function(err,data){
            if(err){
               // console.log('err',err) 
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
});

//移动文件到回收站
router.post('/MoveFileToRecycleBin',function(req,res,next){
    // console.log('移动文件到回收站');
    let fileId = req.body.fileId;
    let userLoginName = req.body.userLoginName;
    if(fileId){
        FileInfo.findOneAndUpdate({
            fileId: fileId,
            userLoginName: userLoginName,
        },{
            inRecycleBin:req.body.inRecycleBin
        },function(err,data){
            if(err){
               // console.log('err',err) 
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
});

//删除一个项目文件夹
router.post('/DeleteAFlie',function(req,res,next){
    // console.log('删除回收站的文件夹');
    let fileId = req.body.fileId;
    let userLoginName = req.body.userLoginName;
    if(fileId){
        FileInfo.findOneAndDelete({
            fileId: fileId,
            userLoginName: userLoginName,
            inRecycleBin: true
        },function(err,data){
            if(err){
               // console.log('err',err) 
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
});

module.exports = router;
