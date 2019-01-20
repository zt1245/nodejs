const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const url = 'mongodb://127.0.0.1:27017';

const brandModel = {
    //新增
    add(data,cb){
        MongoClient.connect(url,function(err,client){
            if (err) {
                console.log('连接数据库失败');
                cb({code: -100,msg: '连接数据库失败'});
            }else {
                const db = client.db('zt');
                var brandData = {
                    name: data.name,
                    imgSrc: data.imgSrc
                };
                var Num = 0;
                async.series([
                    //查询总条数
                    function(callback){
                        db.collection('brand').find().count(function(err,num){
                            if (err) {
                                console.log('查询总条数失败');
                                callback({code: -102,msg: '查询总条数失败'});
                            }else if(num <= 0){
                                brandData._id = 1;
                                callback(null);
                            }else {
                                console.log('查询成功');
                                Num = num;
                                callback(null,num);
                            }
                        });
                    },

                    //查询最后一条数据
                    function(callback){
                        if (Num <= 0) {
                            brandData._id = 1;
                            callback(null);
                        } else {
                            db.collection('brand').find().skip(Num - 1).toArray(function (err, data) {
                                if (err) {
                                    console.log('查询最后一条数据失败', err);
                                    callback({ code: -101, msg: '查询数据库失败' });
                                } else {
                                    brandData._id = data[0]._id + 1;
                                    callback(null);
                                }
                            });
                        }
                    },

                    //插入数据
                    function(callback){
                        db.collection('brand').insertOne(brandData, function (err) {
                            console.log('+++++++++++++++++');
                            if (err) {
                                console.log('===================');
                                console.log('插入数据库失败', err);
                                callback({ code: -101, msg: '插入数据库失败' });
                            } else {
                                console.log('----------------');
                                console.log('插入成功');
                                callback(null);
                            }
                        })
                    }
                ],function(err,result){
                    if (err) {
                        console.log('以上三步操作可能出现问题');
                        cb({code: -102,msg: '以上三步操作可能出现了问题'});
                    }else {
                        console.log(result);
                        cb(null);
                    }
                    client.close();
                })
            }
        })
    },
    //查询
    search(data,cb){
        MongoClient.connect(url,function(err,client){
            if (err) {
                console.log('连接数据库失败');
                cb({ code: -100, msg: '连接数据库失败'});
            }else {
                console.log('连接数据库成功');
                const db = client.db('zt');
                var limitNum = parseInt(data.pageSize);
                var skipNum = parseInt(data.pageSize * data.page - data.pageSize);
                async.parallel([
                    //查询总条数
                    function(callback){
                        db.collection('brand').find().count(function(err,num){
                            if (err) {
                                console.log('查询总条数失败');
                                callback({code: -102,msg: '查询总条数失败'});
                            }else{
                                console.log('查询成功');
                                callback(null,num);
                            }
                        })
                    },
                    function(callback){
                        db.collection('brand').find().limit(limitNum).skip(skipNum).toArray(function(err,data){
                            if (err) {
                                console.log('查询失败');
                                callback({code: -102,msg: '查询失败'});
                            }else {
                                console.log('查询成功');
                                callback(null,data);
                            }
                        });
                    }
                ],function(err,result){
                    if (err) {
                        console.log('以上两个步骤可能出现了错误');
                        cb({code: -102,msg: err});
                    }else {
                        console.log('成功');
                        cb(null,{
                            totalPage: Math.ceil(result[0]/data.pageSize),
                            brandList: result[1],
                            page: data.page
                        });
                    }
                    client.close();
                })
            }
        })
    },
    //修改
    update(data,cb){
        MongoClient.connect(url,function(err,client){
            if (err) {
                console.log('连接数据库失败');
                cb({code: -100,msg: '连接数据库失败'});
            }else {
                const db = client.db('zt');
                db.collection('brand').update({'_id': parseInt(data._id)},{$set: {
                    'name': data.name,
                    'imgSrc': data.imgSrc
                }},function(err){
                    if (err) {
                        console.log('修改失败');
                        cb({code: -102,msg: '修改失败'});
                    }else {
                        console.log('修改成功');
                        cb(null);
                    }
                })
            }
        })
    },

    //删除
    delete(data,cb){
        MongoClient.connect(url,function(err,client){
            if (err) {
                console.log('连接数据库失败');
                cb({code: -100,msg: '连接数据库失败'});
            }else {
                console.log('连接数据库成功');
                const db = client.db('zt');
                db.collection('brand').remove({'_id': parseInt(data._id)},function(err){
                    if (err) {
                        console.log('删除失败');
                        cb({code: -102,msg: '删除失败'});
                    }else {
                        console.log('删除成功');
                        cb(null);
                    }
                })
            }
        })
    }

}

module.exports = brandModel;