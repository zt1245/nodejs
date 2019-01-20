var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var brandModel = require('../model/brandModel');
const upload = require('multer')({
    dest: 'D:/pmp/'
});

//新增品牌操作
router.post('/add',upload.single('file'),function(req,res){
    console.log(req.body);
    console.log(req.file);
    // res.send();
    fs.readFile(req.file.path,function(err,data){
        if (err) {
            console.log('读取文件失败');
            res.send({code: -1,msg: '读取文件失败'});
        }else {
            //进行写入文件的操作
            console.log('读取文件成功');
            var rename = new Date().getTime() + req.file.originalname;
            var fileUrl = path.resolve(__dirname, '../public/brand/', rename);
            fs.writeFile(fileUrl,data,function(err){
                if (err) {
                    console.log('写入文件失败');
                    res.send({code: -1,msg: '写入文件失败'});
                }else {
                    console.log('写入文件成功');
                    var brandObj = {
                        name: req.body.name,
                        imgSrc: rename
                    };
                    brandModel.add(brandObj, function (err) {
                        if (err) {
                            console.log('保存失败');
                        } else {
                            console.log('保存数据成功');
                            res.send();
                        }
                    });
                }
            })
        }
    })
})


//加载品牌操作
router.get('/search',function(req,res){
    let page = req.query.page || 1;
    let pageSize = req.query.pageSize || 3;
    brandModel.search({
        page: page,
        pageSize: pageSize
    },function(err,data){
        if (err) {
            console.log('查询失败');
            res.send({code: -1,msg: '查询失败'});
        }else {
            console.log('查询成功');
            res.send({code: 0,msg: '查询成功',data: data});
        }
    })
})

//修改
router.post('/update',upload.single('File'),function(req,res){
    console.log(req.body);
    console.log(req.file);
    // res.send();
    fs.readFile(req.file.path,function(err,data){
        if (err) {
            console.log('读文件失败');
            res.send({code: -1,msg: '读文件成功'});
        }else {
            var rename = new Date().getTime() + req.file.originalname;
            var fileUrl = path.resolve(__dirname,'../public/brand/',rename);
            fs.writeFile(fileUrl,data,function(err){
                if (err) {
                    console.log('写文件失败');
                    res.send({code: -1,msg: '写文件失败'});
                }else {
                    console.log('写文件成功');
                    var brandObj = {
                        name: req.body.Name,
                        _id: req.body._id,
                        imgSrc: rename
                    };
                    brandModel.update(brandObj,function(err){
                        if (err) {
                            console.log('修改失败');
                            res.send({code: -1,msg: '修改失败'});
                        }else {
                            console.log('修改成功');
                            res.send({code: 0,msg: '修改成功'});
                        }
                    });
                    // res.send();
                }
            })
        }
    })
})

//删除
router.get('/delete',function(req,res){
    brandModel.delete({
        _id: req.query.num
    },function(err){
        if (err) {
            console.log('删除失败');
            res.send({code: -1,msg: '删除失败'});
        }else {
            console.log('删除成功');
            res.send({code: 0,msg: '删除成功'});
        }
    })
})
module.exports = router;
