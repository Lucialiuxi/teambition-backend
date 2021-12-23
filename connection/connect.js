let mongoose = require('mongoose')

var url = 'mongodb://localhost:27017/local';

//连接数据库
mongoose.connect(url,function(err){
    if(err){
        console.log('连接失败')
        return;
    }else{
        console.log('连接成功')
    }
});