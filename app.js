//入口文件
let express = require('express');

//连接数据库
require('./connection/connect');

let app = express();

const cors = require('cors');

app.use(cors({
    credentials:true,
    origin:'*',
    optionsSuccessStatus: 200  // 响应option请求为200，目的就是节约时间，告诉前端可以正常发请求
}));

//引入API （就像引入vue中间件一样）
app.use('/user',require('./routers/user.js'));
app.use('/file',require('./routers/file.js'));
app.use('/task',require('./routers/task.js'));


app.listen(8080);
