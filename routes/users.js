const express = require('express');
const router = express.Router();
const usersModel = require('../model/usersModel');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//注册用户处理
router.post('/register',function(req,res){
  //用户名验证
  //1.用户名必须是由数字，字母，下划线组成是5-10位的字符
  if(!/^\w{5,10}$/.test(req.body.username)){
    res.render('zerror',{
      code: -1,
      msg: '用户名必须是由数字，字母，下划线组成是5-10位的字符'
    })
    return;
  }
  //密码验证
  //2.密码必须是由数字，字母，下划线组成是6-18位的字符
  if (!/^\w{6,18}$/.test(req.body.password)){
    res.render('zerror',{
      code: -1,
      msg: '密码必须是由数字，字母，下划线组成是6-18位的字符'
    })
    return;
  }
  //密码相等验证
  //3.确认密码必须与密码的输入一致
  if(!(req.body.password == req.body.repassword)){
    res.render('zerror',{
      code: -1,
      msg: '两次输入的密码不一致'
    })
    return;
  }
  //昵称验证
  //4.昵称必须是由数组字母下划线以及中文组成的3-8位的字符
  if (!/^[\w\u4e00-\u9fa5]{2,8}$/.test(req.body.nickname)){
    res.render('zerror',{
      code: -1,
      msg: '昵称必须是由数组字母下划线以及中文组成的2-8位的字符'
    })
    return;
  }
  //手机号验证
  //5.手机号必须是11位数字组成的字符
  if (!/^1[34578]\d{9}$/.test(req.body.phone)){
    res.render('zerror',{
      code: -1,
      msg: '手机号必须是11位数字组成的字符'
    })
    return;
  }
  // res.end();

  usersModel.add(req.body,function(err){
    if (err) {
      res.render('zerror',err);
    }else {
      res.redirect('/login.html');
    }
  })
})

//登录处理
router.post('/login',function(req,res){
  // console.log('==============================11111111');
  usersModel.login(req.body,function(err,data){
    if (err) {
      res.render('zerror',err);
    }else{
      console.log('用户的信息为',data);
      //写数据，并跳转到首页
      res.cookie('username', data.username,{
        maxAge: 1000*60*10000,
      });
      res.cookie('nickname', data.nickname,{
        maxAge: 1000 * 60 * 10000,
      });
      res.cookie('isAdmin', data.isAdmin,{
        maxAge: 1000 * 60 * 10000,
      });
      // console.log('==================================');
      res.redirect('/');
    }
  })
})

//退出登录处理
router.get('/logout',function(req,res){
  //清除cookie
  res.clearCookie('username');
  res.clearCookie('nickname');
  res.clearCookie('isAdmin');
  //退出登录到登录页面
  // res.redirect('/login.html');
  res.send('<script>location.replace("/")</script>');
})

//搜索操作
router.get('/search',function(req,res){
  // console.log('================搜索操作==================');
  var page = req.query.page || 1;
  var pageSize = req.query.pageSize || 5;
  let nickname = new RegExp(req.query.nickname);
  var nicknameUrl = req.query.nickname;
  console.log(nicknameUrl);
  // console.log(page,pageSize);
  // console.log(req.body.nickname);
  // console.log(req.route);
  if (req.query.nickname == ''){
    res.redirect('/user_manage.html');
  }else {
    usersModel.getSearchList({
      page: page,
      pageSize: pageSize,
      nickname: nickname
    }, function (err, data) {
      if (err) {
        res.render('zerror', err);
      } else {
        res.render('user_manage', {
          username: req.cookies.username,
          nickname: req.cookies.nickname,
          isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' : '(普通用户)',
          userList: data.userList,
          page: data.page,
          totalPage: data.totalPage,
          nicknameUrl: nicknameUrl
        });
      }
    })
  }
})

//修改操作
router.post('/update',function(req,res){
  var pageSize = req.query.pageSize || 5;
  var page = req.body.u_page;
  console.log(page);
  usersModel.update({
    page: req.body.u_page,
    pageSize: pageSize,
    nickname: req.body.nickname,
    phone: req.body.phone,
    sex: req.body.sex,
    isAdmin: req.body.isAdmin,
    age: req.body.age,
    _id: req.body._id
  },function(err){
    if (err) {
      res.render('zerror',err);
    }else {
      res.redirect('/user_manage.html?page=' + page);
    }
  })
})

//删除操作
router.get('/delete', function (req, res) {
  var page = req.query.page || 1;
  var pageSize = req.query.pageSize || 5;
  var nicknameUrl = req.query.nickname || '';
  // console.log('++++++++++++++++++++++++++');
  usersModel.delete({
    page: page,
    pageSize: pageSize,
    _id: req.query._id
  }, function (err, data) {
    if (err) {
      res.render('zerror', err);
    } else {
      // console.log('yoyyoyiyoyo');
      res.redirect('/user_manage.html?page='+page);
    }
  })
})
module.exports = router;
