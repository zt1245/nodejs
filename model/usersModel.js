// 模块，是用来操作users相关的后台数据库处理的代码
// 注册操作
// 登录操作
// 修改操作
// 删除操作
// 查询列表操作

const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const url = 'mongodb://127.0.0.1:27017';

const usersModel = {
    //注册方法
    /**
     * @param {Object} data 注册信息
     * @param {Function} cb 回调函数
     */
    add(data,cb){
        MongoClient.connect(url,function(err,client){
            if (err) {
                console.log('连接数据库失败');
                cb({code: -100,msg: '连接数据库失败'});
            }
            const db = client.db('zt');
            let savaData = {
                username: data.username,
                password: data.password,
                nickname: data.nickname,
                phone: data.phone,
                is_admin: data.isAdmin
            };
            var Num = 0;

            //==============使用async的串行无关联来写=================
            async.series([
                //查询是否已经注册
                function(callback){
                    db.collection('user').find({ username: savaData.username}).count(function(err,num){
                        if (err) {
                            console.log('查询是否已经注册失败');
                            callback({code: -101,msg: '查询是否已经注册失败'});
                        }else if(num != 0){
                            console.log('用户名已经注册过了');
                            callback({code: -101,msg: '用户名已经注册过了'});
                        }else{
                            console.log('当前用户可以进行注册操作了');
                            callback(null);
                        }
                    })
                },

                //查询所有表的记录条数
                function(callback){
                    db.collection('user').find().count(function(err,num){
                        if (err) {
                            console.log('查询所有表的记录条数失败');
                            callback({code: -101,msg: '查询所有表的记录条数失败'});
                        } else if (num <= 0) {
                            savaData._id = 1;
                            callback(null);
                        } else {
                            console.log('查询成功');
                            Num = num;
                            callback(null, num);
                        }
                    })
                },

                //取到最后一条数据，拿到最后一条数据的_id,根据这个_id让这个_id+1
                function(callback){
                    // console.log(Num);
                    console.log(typeof Num);
                    if (Num <= 0) {
                        savaData._id = 1;
                        callback(null);
                    } else{
                        db.collection('user').find().skip(Num - 1).toArray(function (err, data) {
                            if (err) {
                                callback({ code: -101, msg: '查询最后一条数据失败' });
                            } else {
                                // console.log(data[0]._id);
                                savaData._id = data[0]._id + 1;
                                // console.log('======dddddddd');
                                // console.log(savaData);
                                callback(null);
                            }
                        })
                    }
                },

                //写入数据库操作
                function(callback){
                    db.collection('user').insertOne(savaData,function(err){
                        if (err) {
                            console.log('写入数据库操作失败');
                            callback({code: -101,msg: '写入数据库操作失败'});
                        }else {
                            callback(null);
                        }
                    })
                }

            ],function(err,result){
                if (err) {
                    console.log('上面的三步操作可能出了问题',data);
                    cb(err);
                }else {
                    cb(null);
                }
                client.close();
            })
        })
    },
    //登录方法
    /**
     * 
     * 
     * @param {Object} data 登录信息
     * @param {Function} cb 回调函数
     */
    login(data,cb){
        MongoClient.connect(url,function(err,client){
            if (err) {
                cb({code: -100,msg: '连接数据库操作失败'});
            }else {
                const db = client.db('zt');
                //匹配用户名密码
                db.collection('user').find({
                    username: data.username,
                    password: data.password
                }).toArray(function(err,data){
                    if (err){
                        console.log('查询数据库失败',err);
                        cb({code: -101,msg: '查询数据库失败'});
                    }else if(data.length <= 0){
                        console.log('用户不能登录');
                        cb({code: -101,msg: '用户名或密码错误'});
                    }else {
                        console.log('用户可以进行登录操作了',data);
                        cb(null,{
                            username: data[0].username,
                            nickname: data[0].nickname,
                            isAdmin: data[0].is_admin
                        });
                    }
                    //关闭操作
                    client.close();
                })
            }
        })
    },


    /**
     * 
     * @param {Object} data 页码信息与每页显示的条数
     * @param {Function} cb 回调函数
     */
    getUserList(data,cb){
        MongoClient.connect(url,function(err,client){
            if (err) {
                console.log('连接数据库失败');
                cb({code: -100,msg: '连接数据库失败'});
            }else {
                const db = client.db('zt');
                const limitNum = parseInt(data.pageSize);  //每页显示的条数
                const skipNum = data.page * data.pageSize - data.pageSize;

                async.parallel([
                    //查询所有记录的条数
                    function(callback){
                        db.collection('user').find().count(function(err,num){
                            if (err) {
                                console.log('查询数据库的所有记录条数失败');
                                callback({code: -101,msg: '查询数据库的所有记录条数失败'});
                            }else {
                                callback(null,num);
                            }
                        })
                    },
                    //查询分页的数据
                    function(callback){
                        db.collection('user').find().limit(limitNum).skip(skipNum).toArray(function(err,data){
                            if (err) {
                                callback({code: -101,msg: '查询分页的数据失败'});
                            }else {
                                callback(null,data);
                            }
                        })
                    }
                ],function(err,result){
                    if (err) {
                        cb(err);
                    }else {
                        cb(null,{
                            totalPage: Math.ceil(result[0] / data.pageSize),
                            userList: result[1],
                            page: data.page
                        })
                        // console.log({
                        //     totalPage: Math.ceil(result[0] / data.pageSize),
                        //     userList: result[1],
                        //     page: data.page
                        // });
                    }
                    client.close();
                })
            }
        })
    },


    //搜索匹配操作
    /**
     * 
     * 
     * @param {Object} data 根据nickname模糊匹配用户的信息
     * @param {Function} cb 回调函数
    
     * 
     */
    getSearchList(data,cb){
        MongoClient.connect(url,function(err,client){
            if (err) {
                console.log('连接数据库失败');
                cb({code: -100,msg: '连接数据库失败'});
            }else {
                const db = client.db('zt');
                const limitNum = parseInt(data.pageSize);  //每页显示的条数
                const skipNum = data.page * data.pageSize - data.pageSize;
                async.parallel([
                    function(callback){
                        //查询符合匹配的条数
                        db.collection('user').find({ nickname: data.nickname }).count(function(err,num){
                            if (err) {
                                callback({code: -101,msg: '查询匹配条数失败'});
                            }else {
                                callback(null,num);
                            }
                        })
                    },

                    function(callback){
                        //查询符合模糊匹配的记录
                        db.collection('user').find({ nickname: data.nickname }).limit(limitNum).skip(skipNum).toArray(function (err, data) {
                            if (err) {
                                console.log('搜索匹配失败')
                                callback({ code: -101, msg: '搜索匹配失败' });
                            } else {
                                callback(null, data);
                            }
                        });
                    }
                ],function(err,result){
                    if (err) {
                        cb(err);
                    }else {
                        cb(null,{
                            totalPage: Math.ceil(result[0] / data.pageSize),
                            userList: result[1],
                            page: data.page,
                        });
                        // console.log('=============搜索信息');
                        // console.log({
                        //     totalPage: Math.ceil(result[0] / data.pageSize),
                        //     userList: result[1],
                        //     page: data.page,
                        // });
                    }
                })
            }
        });
    },

    /**
     * 
     * 
     * @param {Object} data   //修改的信息
     * @param {Function} cb   //回调函数
    
     * 
     */
    //修改的操作
    update(data,cb){
        console.log('*********************');
        console.log(data);
        MongoClient.connect(url,function(err,client){
            if (err) {
                console.log('连接数据库失败');
                cb({code: -100,msg: '连接数据库失败'});
            }else {
                const db = client.db('zt');
                let updataData = {
                    nickname: data.nickname,
                    phone: data.phone,
                    sex: data.sex,
                    is_admin: data.isAdmin,
                    age: data.age
                };
                // console.log(data);
                // console.log('------------------------');
                // console.log(updataData);
                const limitNum = parseInt(data.pageSize);  //每页显示的条数
                const skipNum = data.page * data.pageSize - data.pageSize;
                async.series([
                    function(callback){
                        //修改数据
                        db.collection('user').update({ '_id': parseInt(data._id) }, { $set: {
                            nickname: data.nickname,
                            phone: data.phone,
                            sex: data.sex,
                            is_admin: data.isAdmin,
                            age: data.age
                        } }, function (err) {
                            if (err) {
                                // console.log('======xiugai=========');
                                callback({code: -101,msg: '修改数据失败'});
                            }else {
                                // console.log('======xiugai11111111=========');
                                callback(null);
                            }
                        });
                    },

                    function(callback){
                        //查询记录条数
                        db.collection('user').find().count(function(err,num){
                            if (err) {
                                callback({code: -101,msg: '查询记录条数失败'});
                            }else {
                                callback(null,num);
                            }
                        })
                    },

                    //查询分页的数据
                    function (callback) {
                        db.collection('user').find().limit(limitNum).skip(skipNum).toArray(function (err, data) {
                            if (err) {
                                callback({ code: -101, msg: '查询分页的数据失败' });
                            } else {
                                callback(null, data);
                            }
                        })
                    }
                ],function(err,result){
                    if (err) {
                        cb(err);
                    }else{
                        cb(null, {
                            totalPage: Math.ceil(result[1] / data.pageSize),
                            userList: result[2],
                            page: data.page,
                        });
                        // console.log(result);
                    }
                    client.close();
                })
                
            }
        })
    },

    //删除操作
    /**
     * 
     * 
     * @param {Object} data  //删除的信息
     * @param {Function} cb  //回调函数
    
     * 
     */
    delete(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败');
                cb({ code: -100, msg: '连接数据库失败' });
            } else {
                const db = client.db('zt');
                const limitNum = parseInt(data.pageSize);  //每页显示的条数
                const skipNum = data.page * data.pageSize - data.pageSize;
                async.series([
                    function (callback) {
                        //修改数据
                        db.collection('user').deleteOne({ '_id': parseInt(data._id) },function (err) {
                            if (err) {
                                // console.log('======del=========');
                                callback({ code: -101, msg: '删除数据失败' });
                            } else {
                                // console.log('======删除11111111=========');
                                callback(null);
                            }
                        });
                    },

                    function (callback) {
                        //查询记录条数
                        db.collection('user').find().count(function (err, num) {
                            if (err) {
                                callback({ code: -101, msg: '查询记录条数失败' });
                            } else {
                                callback(null, num);
                            }
                        })
                    },

                    //查询分页的数据
                    function (callback) {
                        db.collection('user').find().limit(limitNum).skip(skipNum).toArray(function (err, data) {
                            if (err) {
                                callback({ code: -101, msg: '查询分页的数据失败' });
                            } else {
                                callback(null, data);
                            }
                        })
                    }
                ], function (err, result) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, {
                            totalPage: Math.ceil(result[1] / data.pageSize),
                            userList: result[2],
                            page: data.page,
                        });
                        // console.log(result);
                    }
                    client.close();
                })

            }
        })
    },
}

module.exports = usersModel;