let User = require('../models/userModel');
let express = require('express');
var router = express.Router();

//解析post请求主体的键值对
const bodyParser = require('body-parser');

// 解析post请求中的xhr.setRequestHeader( 'Content-Type','application/x-www-form-urlencoded')
router.use(bodyParser.urlencoded({ extended: true }))
//parse application/json
router.use(bodyParser.json())

//注册
router.post('/usersRegister',function(req,res,next){
    let un = req.body.username;
    let pw = req.body.password;
    let state = true;//判断是否可以注册
    console.log('注册')
    //先验证用户名是否存在
    User.findOne({
        username:un
    }).exec(function(err,adventure){
        console.log('exec',err,adventure)
        if(err){//错误
            // console.log('err',err)
            return;
        }
        //返回给前端
        if(adventure){
            res.json({
                code:0,
                message:'用户名已存在'
            })
        }else{
            User.create({
                username:un,
                password:pw
            },function (err,data) {
                if(err){
                    return;
                }
                res.json({
                    code:1,
                    message:'用户名注册验证通过'
                })
            });
        }
    })
})


//登录
router.post('/userLogin',function(req,res,next){
    let un = req.body.username;
    let pw = req.body.password;
    console.log(un,pw)
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
                        message:'登录验证成功'
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


module.exports = router;
