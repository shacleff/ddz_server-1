const express = require('express');
const router = express.Router();
// 导入MySQL模块
const mysql = require('mysql');
const dbConfig = require('../db/dbconfig');
const userSQL = require('../db/usersql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
const pool = mysql.createPool(dbConfig.mysql);
// 响应一个JSON数据
let responseJSON = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '-200', msg: '操作失败'//todo
        });
    } else {
        res.json(ret);
    }
};
// 添加用户
router.post('/reg', function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
// 获取前台页面传过来的参数  
        let reqBody = req.body;
// 建立连接 增加一个用户信息
        connection.query(userSQL.insert, [reqBody.username, reqBody.password], function (err, result) {
            if (result) {
                result = {
                    code: 200,
                    msg: '增加成功'
                };
            }

            // 以json形式，把操作结果返回给前台页面
            responseJSON(res, result);

            // 释放连接
            connection.release();

        });
    });
});
router.post('/login', function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        // 获取前台页面传过来的参数
        let reqBody = req.body;
        console.log(req.body);
        // 建立连接 增加一个用户信息
        connection.query(userSQL.getUserByUsername, [reqBody.username], function (err, result) {
            console.log(result);
            if (result) {
                result = {
                    code: 200,
                    msg: '登录成功'
                };
            }

            // 以json形式，把操作结果返回给前台页面
            responseJSON(res, result);

            // 释放连接
            connection.release();

        });
    });
});
module.exports = router;