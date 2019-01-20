var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var phoneModel = require('../model/phoneModel');
const upload = require('multer')({
    dest: 'D:/tmp/'
});

//新增手机的操作
router.post('/add',upload.single('file'),function(req,res){
    console.log(req.body);
    console.log(req.file);
    fs.readFile(req.file.path,function(err,data){
        if (err) {
            console.log('读文件失败');
            res.send({code: -103,msg:'读文件失败'});
        }else {
            var fileUrl = path.resolve(__dirname,'../public/phone/',new Date().getTime()+req.file.originalname);
            var renameArr = fileUrl.split('\\');
            var rename = renameArr[renameArr.length-1];
            console.log(rename);
            fs.writeFile(fileUrl,data,function(err){
                if (err) {
                    console.log('写入文件失败');
                    res.send({code: -103,msg: '写入文件失败'});
                }else {
                    console.log('写入文件成功');
                    var phoneObj = {
                        name: req.body.name,
                        brand: req.body.brand,
                        official_price: req.body.official_price,
                        recovery_price: req.body.recovery_price,
                        imgSrc: rename
                    };
                    phoneModel.add(phoneObj,function(err){
                        if (err) {
                            console.log('保存失败');
                        }else {
                            console.log('保存数据成功');
                            res.send();
                        }
                    });
                }
            });
        }
    })
    // res.send();
})

//查询数据的操作
router.get('/search',function(req,res){
    console.log('======================');
    res.set('Access-Control-Allow-Origin','*');
    let page = req.query.page || 1;
    let pageSize = req.query.pageSize || 3;
    phoneModel.search({
        page: page,
        pageSize: pageSize
    },function(err,data){
        if (err) {
            console.log('查询失败');
            res.send({ code: -101, msg: '查询失败'});
        }else{
            console.log('查询成功================================================================');
            // console.log(data);
            res.send({ code: 1, msg: '查询成功', data: data});
        }
    })
    // res.send();
})

//修改数据
router.post('/update', upload.single('File'),function(req,res){
    console.log(req.body);
    console.log(req.file);
    // res.send();
    fs.readFile(req.file.path,function(err,data){
        if (err) {
            console.log('读文件失败');
            releaseEvents.send({code: -103,msg: '读文件失败'});
        }else {
            var fileUrl = path.resolve(__dirname,'../public/phone',new Date().getTime()+req.file.originalname);
            var renameArr = fileUrl.split('\\');
            var rename = renameArr[renameArr.length-1];
            console.log(rename);
            fs.writeFile(fileUrl,data,function(err){
                if (err) {
                    console.log('写入文件失败');
                    res.send({code: -103,msg: '写入文件失败'});
                }else {
                    console.log('写入文件成功');
                    // res.send();
                    var phoneObj = {
                        name: req.body.Name,
                        brand: req.body.Brand,
                        official_price: req.body.Official_price,
                        recovery_price: req.body.Recovery_price,
                        imgSrc: rename,
                        _id: req.body._id
                    };
                    phoneModel.update(phoneObj,function(err){
                        if (err) {
                            console.log('保存失败');
                        }else {
                            console.log('保存数据成功');
                            res.send({ code: 1, msg: '保存数据成功', imgSrc: rename, _id: req.body._id});
                        }
                    })
                }
            })
        }
    })
})
//删除数据
router.get('/del',function(req,res){
    // console.log(req.query.num);
    phoneModel.delete({
        _id: req.query.num
    },function(err,data){
        if (err) {
            console.log('删除失败');
            res.send({code: -1,msg: '删除失败'});
        }else {
            res.send({code: 0,msg: '删除成功'});
        }
    })
})
//option的信息查询
router.get('/option',function(req,res){
    phoneModel.option(function(err,data){
        if (err) {
            console.log('查询失败');
            res.send({code: -1,msg: '查询失败'});
        }else {
            res.send({code: 0,msg: '查询成功',data:data});
        }
    })
})
module.exports = router;
