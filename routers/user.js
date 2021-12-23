//注册的用户信息
let User = require('../models/userModel');

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
                // console.log(data)
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
});

//登录
router.post('/userLogin',function(req,res,next){
    let un = req.body.username;
    let pw = req.body.password;
    // console.log(un,pw)
    console.log('登录')
    User.findOne({
        username:un
    },function(err,adventure){
        // console.log(err,adventure)
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
                // console.log(error,data)
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
});

module.exports = router;
