var express = require('express');
var router = express.Router();
const usersModel = require('../model/usersModel');

//index html
router.get('/', function(req, res, next) {
  // console.log('返回的操作是否有进来');
  if(req.cookies.username){
    res.render('index',{
      username: req.cookies.username,
      nickname: req.cookies.nickname,
      isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' : '(普通用户)'
    })
  }else {
    res.redirect('/login.html');
  }
});

//register html
router.get('/register.html',function(req,res){
  res.render('register');
})


//login html
router.get('/login.html',function(req,res){
  res.render('login');
})

//用户管理页面
router.get('/user_manage.html',function(req,res){
  //需要判断用户是否登录，以及用户是否是管理员
  // console.log('==========shoujiguanli');
  if (req.cookies.username && parseInt(req.cookies.isAdmin)){
    var page = req.query.page || 1;
    var pageSize = req.query.pageSize || 5;
    var nicknameUrl = req.query.nickname;
    console.log(nicknameUrl);
    usersModel.getUserList({
      page: page,
      pageSize: pageSize
    },function(err,data){
      if (err) {
        res.render('zerror',err);
      }else {
        res.render('user_manage',{
          username: req.cookies.username,
          nickname: req.cookies.nickname,
          isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' : '(普通用户)',
          userList: data.userList,
          page: data.page,
          totalPage: data.totalPage,
          nicknameUrl: nicknameUrl
        });
        // console.log('用户==================');
        // console.log({
        //   username: req.cookies.username,
        //   nickname: req.cookies.nickname,
        //   isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' : '(普通用户)',
        //   userList: data.userList,
        //   page: data.page,
        //   totalPage: data.totalPage
        // });
      }
    })
  }else {
    res.redirect('/login.html');
  }
})
//手机管理
router.get('/mobile_manage.html', function (req, res) {
  //需要判断用户是否登录，以及用户是否是管理员
  if (req.cookies.username){
    res.render('mobile_manage', {
      username: req.cookies.username,
      nickname: req.cookies.nickname,
      isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' : '(普通用户)'
    });
  }else {
    res.redirect('/login.html');
  }
})
//品牌管理
router.get('/brand_manage.html', function (req, res) {
  //需要判断用户是否登录，以及用户是否是管理员
  if (req.cookies.username) {
    res.render('brand_manage', {
      username: req.cookies.username,
      nickname: req.cookies.nickname,
      isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' : '(普通用户)'
    });
  } else {
    res.redirect('/login.html');
  }
})
module.exports = router;
