var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon'); //图标组件由static-favicon改为serve-favicon
var logger = require('morgan'); //此模块及以下部分模块由express分离出来
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var moment = require('moment');
var session = require('express-session');
var RedisStore = require('connect-redis')(session); //connect-mongo(session),mongoose(orm)
var app = express();

app.set('port', process.env.PORT || 3300);

// view engine setup环境变量设置
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '3mb'
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //浏览器可以直接访问public下的资源
var store = new RedisStore({
    host: 'localhost',
    port: 6379,
    prefix: 'tobi'
});

app.use(session({
    store: store,
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//需要密码验证
//app.use(session({
//    secret:mongodb.cookieSecret,
//    store: new MongoStore({
//        url:"mongodb://"+mongodb.uid+":"+mongodb.pwd+"@"+mongodb.host+":"+mongodb.port+"/"+mongodb.db
//    })
//}));
app.use('/*', function(req, res, next) {
    console.log("请求/*", session.maxAge)

    var user = req.session.user;
    if (user) {
        console.log(user)
    }
    user = {
        username: "lixd",
        passwd: "123456",
        time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    res.cookie('autologin2222', 1, {
        expires: new Date(Date.now() + 864000000) //10天
    });
    req.session.user = user;
    if (req.originalUrl.indexOf('/admin') === -1) {
        //pvLog(req);
    }
    next();
});

app.use('/login',function(req,res){
  res.render('login', {
      message: "hello",
      error: "err"
  });
});

/**
 * 后台动态显示用户登录状态
 * 前台放在前面不进行验证
 * 未登录状态下跳转到登录页面，点击登录时（此时还未登录）不对“/doLogin”进行验证直接转交给下一个路由。
 * 如果是登录状态则直接转交给下一个路由
 **/
app.use('/admin', function(req, res, next) {
    if (req.cookies['autologin']) {
        next();
        return;
    }
    if (!req.session.user) {
        if (req.url == "/doLogin") {
            next();
            return;
        }
        res.render('admin/login');
    } else if (req.session.user) {
        next();
    }
});
//app.use('/admin', admin); //添加路由-后台登陆-添加博客
// catch 404 and forward to error handler
// this middleware will be executed for every request to the app
//加next每个请求都会经过，不加next所有请求不会通过，没有交给下一个路由
/*添加路由*/
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(app.get('port'), function() {
    console.log('Server up on: http://localhost:' + app.get('port'));
});

module.exports = app;
