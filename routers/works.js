//注册的用户信息
let Works = require('../models/worksInfoModel');

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
// 查询works文件的显示模式
router.post('/getWorkFileViewType',function(req,res){
    // console.log('查询一个项目文件下的任务列表')
    let { username } = req.body;
    if(username){
        Works.find({
            username,
        },function(err,data){
            // console.log(err,data)
            if(err){
                // console.log('err',err)
            }else if(data){
                res.json({
                    success:true,
                    code:33,
                    message:'成功查询works文件的显示模式',
                    data: data.length ? data[0] :  { worksViewType: 'ListView' },
                })
            }
        })
    }
})

module.exports = router;
