//注册的用户信息
let Works = require('../models/worksInfoModel');
const { v4: uuidv4 } = require('uuid');

let express = require('express');
let router = express.Router();

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

/*
 * 切换 缩略图模式ThumbnailView / 列表模式ListView
 * @param { username:String , worksViewType:String } param
 */
router.post('/ChangeWorksViewType',async function(req,res){
    let { username, worksViewType } = req.body;
    if(username){
        const result = await Works.findOneAndUpdate({ username },{ worksViewType });
        res.json({
            success: !result ? false : true,
            code: !result ? 400 : 200,
            message: !result || "切换文件显示模式成功",
            data: result ? worksViewType : '',
        });
    }
})

/**修改work文件名
 * @param {myId: String, workFileName: String} param
 */
router.post('/ModifyAWorkFileName',async function(req,res){
    let { myId, workFileName } = req.body;
    if(myId){
        const result = await Works.findOneAndUpdate({ myId },{ workFileName });
        const data = await Works.find({ myId });

        res.json({
            success: !result ? false : true,
            code: !result ? 400 : 200,
            message: !result || "文件名修改成功",
            data,
        });
    }
})



/**查询当前所在层级的所有works文件
 * @param {username: String , fileId: Number,parentId: String } param
 */
router.post('/GetAllWorksFileUnderParentWorksFile',function(req,res){
    let { fileId, parentId } = req.body;
    if(fileId){
        const requestData = parentId ? req.body : { fileId, parentId: '0' };
        Works.find(requestData,function(err,data){
            console.log(err,data)
            res.json({
                success: err ? false : true,
                code: err ? 400 : 200,
                message: '成功查询works文件的显示模式',
                data: data,
            })
        })
    }
})


/**新建work文件
 *
 * @param { fileId: Number, parentId: String, myId: String, workFileName: String, lastestModifyTime: String} param
 */
router.post('/CreateAWorkFile',function(req,res,next){
    const { workFileName, worksViewType, parentId } = req.body;
    if(workFileName){
        const newData = worksViewType ?
            req.body :
            Object.assign(req.body, {
                worksViewType: 'ListView',
                myId: uuidv4(),
                check: false,
                parentId: parentId || '0',
            });
        Works.create(newData,function(err,data){
            res.json({
                success: err ? false : true,
                code: err ? 400 : 200,
                message: err || '新建项目成功',
                data,
            });
        });
    }

});


/**删除文件夹一个项目文件夹
 * @param {myId:String} param
 */
router.post('/DeleteAWorksFile',function(req,res,next){
    let { myId } = req.body;
    if(myId){
        Works.findOneAndDelete({ myId },function(err,data){
            res.json({
                success: err ? false : true,
                code: err ? 400 : 500,
                message: err || '文件删除成功',
                data,
            });
        });
    }
});

/**
 * 切换work文件选中状态  单选
 * @param {myId:String,check:boolean} param
 */
router.post('/ToSwitchCheckAWorkFile',async function(req,res){
    let { myId, check } = req.body;
    if(myId){
        const result = await Works.findOneAndUpdate({ myId },{ check });
        const data = await Works.find({ myId });
        res.json({
            success: !result ? false : true,
            code: !result ? 400 : 200,
            message: !result || "切换文件显示模式成功",
            data: data[0],
        });
    }
})



/**
 * 根据myId查询works文件的完整信息
 * @param {myId: String} param
 */
router.post('/GetAWorksFileInformationById',function(req,res){
    let { myId } = req.body;
    if(myId){
        Works.find({
            myId,
        },function(err,data){
            res.json({
                success: !err,
                code: !err ? 200 : 400,
                message: err || '文件信息查询成功',
                data: data.length ? data[0] : data,
            })
        })
    }
})

/**
 * 移动OR复制一个workFile到其他文件夹下 keyWord:'复制'/'移动'
 * @param { username: String , myId: String , keyWord:Sting , NewfileId: Number , NewParentId:String ,lastestModifyTime: Number} param
 */
router.post('/MoveOrCopyOneWorkFile',function(req,res,next){
    let { username, myId, keyWord, NewfileId, NewParentId, lastestModifyTime } = req.body;
    if(myId){
        Works.find({
            myId,
            username,
        }, function(err, data){
            if(err){
                return;
            }
            if (keyWord=== '移动') {
                data.forEach(({ myId }) => {
                    Works.findOneAndUpdate({
                        myId
                    },{
                        fileId: NewfileId,
                        parentId: NewParentId,
                    },function(err, result) {
                        console.log("移动:err", err);
                        res.json({
                            success: err ? false : true,
                            message: err || '移动完成',
                            data: result,
                        });
                    });
                });
            } else if (keyWord=== '复制') {
                data.forEach(item => {
                    let newItem = {
                        fileId: NewfileId,
                        parentId: NewParentId,
                        myId: uuidv4(),
                        username,
                        workFileName:  item._doc.workFileName,
                        lastestModifyTime,
                        worksViewType: item._doc.worksViewType,
                        check: false,
                    };
                    Works.create(newItem);
                });
            }
        });
    }
})

module.exports = router;
