const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const url = 'mongodb://127.0.0.1:27017';

const phoneModel = {
    /**
     * 
     * @param {Object} data 
     * @param {Function} cb 
     */
    add(data,cb){
        MongoClient.connect(url,function(err,client){
            // console.log('++++++++++++');
            if (err) {
                console.log('连接数据库失败');
                cb({code: -100,msg: '连接数据库失败'});
            }else {
                // console.log('"""""""""""""""""""');
                var db = client.db('zt');
                let saveData = {
                    name: data.name,
                    brand: data.brand,
                    official_price: data.official_price,
                    recovery_price: data.recovery_price,
                    imgSrc: data.imgSrc
                };
                let phoneNum = 0;
                async.series([
                    //查询数据库总条数
                    function(callback){
                        db.collection('phone').find().count(function(err,num){
                            if (err) {
                                console.log('查询数据库失败');
                                callback({code: -101,msg: '查询数据库失败'});
                            }else if(num<=0){
                                saveData._id = 1;
                                callback(null);
                            }else {
                                console.log('查询成功');
                                phoneNum = num;
                                callback(null,num);
                            }
                        })
                    },

                    //查询最后一条数据
                    function(callback){
                        if (phoneNum <= 0){
                            saveData._id = 1;
                            callback(null);
                        }else{
                            db.collection('phone').find().skip(phoneNum-1).toArray(function (err, data) {
                                if (err) {
                                    console.log('查询最后一条数据失败',err);
                                    callback({ code: -101, msg: '查询数据库失败' });
                                } else {
                                    saveData._id = data[0]._id + 1;
                                    callback(null);
                                }
                            })
                        }
                    },

                    //插入数据
                    function(callback){
                        db.collection('phone').insertOne(saveData,function(err){
                            console.log('+++++++++++++++++');
                            if (err) {
                                console.log('===================');
                                console.log('插入数据库失败',err);
                                callback({code: -101,msg: '插入数据库失败'});
                            }else {
                                console.log('----------------');
                                console.log('插入成功');
                                callback(null);
                            }
                        })
                    }
                ],function(err,result){
                    if (err) {
                        console.log('以三个步骤出错了',err);
                        cb({code: -101,msg: err});
                    }else {
                        console.log(result);
                        cb(null);
                    }
                    client.close();
                })
            }
        })
    },

    //查询所有的手机信息
    /**
     * 
     * 
     * @param {Object} data 所有的手机信息
     * @param {Function} cb 回调函数
    
     * 
     */
    search(data,cb){
        MongoClient.connect(url,function(err,client){
            if (err) {
                cb({code: -100,msg: '连接数据库失败'});
            }else {
                console.log('数据库连接成功');
                const db = client.db('zt');
                var limitNum = data.pageSize;
                var skipNum = data.page * data.pageSize - data.pageSize;
                async.parallel([
                    function(callback){
                        //查询总数量
                        db.collection('phone').find().count(function(err,num){
                            if (err) {
                                console.log('查询总条数失败');
                                callback({code: -101,msg:  '查询总条数失败'});
                            }else {
                                console.log('查询总条数成功');
                                callback(null,num);
                            }
                        })
                    },
                    function(callback){
                        //查询分页的数据
                        // db.collection('phone').find().toArray(function (err, data) {
                        //     if (err) {
                        //         console.log('查询所有的信息失败');
                        //         callback({ code: -101, msg: '查询所有信息失败' });
                        //     } else {
                        //         console.log('查询数据成功======');
                        //         callback(null, data);
                        //          console.log(data);
                        //     }
                        // })
                        db.collection('phone').find().limit(limitNum).skip(skipNum).toArray(function(err,data){
                            if (err) {
                                console.log('查询分页数据失败');
                                callback({code: -101,msg: '查询分页数据失败'});
                            }else {
                                console.log('查询成功');
                                callback(null,data);
                            }
                        })
                    }
                ],function(err,result){
                    if (err) {
                        console.log('以上两个步骤出现问题',err);
                        cb({code: -101,msg: err});
                    }else {
                        cb(null,{
                            totalPage: Math.ceil(result[0] / data.pageSize),
                            phoneList: result[1],
                            page: data.page
                        })
                    }
                    client.close();
                })
            }
        })
    },

    update(data,cb){
        MongoClient.connect(url,function(err,client){
            if (err) {
                console.log('连接数据库失败');
                cb({code: -100,msg: '连接数据库失败'});
            }else {
                console.log('连接成功');
                const db = client.db('zt');
                var _id = parseInt(data._id);
                db.collection('phone').update({ '_id': _id }, { $set: { 
                    'name': data.name,
                    'brand': data.brand,
                    'official_price': data.official_price, 
                    'recovery_price': data.recovery_price, 
                    'imgSrc': data.imgSrc
                }},function(err){
                    if (err) {
                        console.log('修改数据失败');
                        cb({code: -101,msg: err});
                    }else {
                        console.log('修改成功');
                        cb(null);
                    }
                })
            }
        })
    },
    
    delete(data,cb){
        MongoClient.connect(url,function(err,client){
            if (err) {
                console.log('连接数据库失败');
                cb({code:  -100,msg: '连接数据库失败'});
            }else {
                console.log('连接数据库成功');
                const db = client.db('zt');
                db.collection('phone').remove({'_id': parseInt(data._id)},function(err){
                    if (err) {
                        console.log('删除失败');
                        cb({code: -101,msg: '删除失败'});
                    }else {
                        console.log('删除成功');
                        cb(null);
                    }
                    client.close();
                });
            }
        })
    },

    option(cb){
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败');
                cb({ code: -100, msg: '连接数据库失败' });
            } else {
                console.log('连接数据库成功');
                const db = client.db('zt');
                db.collection('brand').find().toArray(function (err, data) {
                    if (err) {
                        console.log('查询失败');
                        cb({ code: -102, msg: '查询失败' });
                    } else {
                        console.log('查询成功');
                        cb(null, data);
                    }
                })
            }
        })
    }

};

module.exports = phoneModel;