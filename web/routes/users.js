const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const Config = require('../config');
const userSQL = require('../db/usersql');
const ERROR_CODE = require(`../error_code`);
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
const pool = mysql.createPool(Config.mysql);
// 响应一个JSON数据
let responseJSON = function (res, ret) {
    res.setHeader("Access-Control-Allow-Origin","http:127.0.0.1:3001");
    res.json(ret);
};
// 添加用户
router.post('/reg', function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        let response = null;

        connection.query(userSQL.getUserByUsername, [req.body.username], function (err, result) {
            console.log(result);
            if (result.length !== 0) {
                response = {
                    error_code: ERROR_CODE.USERNAME_ALREADY_EXITS,
                    msg: '注册失败'
                };
                responseJSON(res, response);

            } else {
                console.log("开始注册");
                const md5 = crypto.createHash('md5');
                let pwd_hash = md5.update(req.body.password).digest("hex");
                connection.query(userSQL.insert, [req.body.username, pwd_hash], function (err, result) {
                    if (result.length !== 0) {
                        response = {
                            error_code: ERROR_CODE.SUCCESS,
                            msg: '注册成功'
                        };
                        responseJSON(res, response);
                    } else {
                        response = {
                            error_code: ERROR_CODE.SUCCESS,
                            msg: '注册成功'
                        };
                        responseJSON(res, response);

                    }

                });
            }
        });
        connection.release();

    });
});
router.post('/login', function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        const md5 = crypto.createHash('md5');
        console.log(req.body);
        let pwd_hash = md5.update(req.body.password).digest("hex");
        connection.query(userSQL.findByUsernameAndPassword, [req.body.username, pwd_hash], function (err, result) {
            console.log(result[0]);
            if (result.length !== 0) {
                let token = jwt.sign({ username: req.body.username }, Config.jwtsecret, {
                    expiresIn: '7d'// 授权时效24小时
                });
                let user_info = {username:result[0].username,
                    nickname:result[0].nickname,
                    gender:result[0].gender,
                    coin:result[0].coin,
                    diamond:result[0].diamond
                }
                response = {
                    error_code: ERROR_CODE.SUCCESS,
                    user_info:user_info,
                    msg: '登录成功',
                    token: token
                };
            } else {
                response = {
                    error_code: ERROR_CODE.USERNAME_OR_PASSWORD_INCORRECT,
                    msg: '登录失败'
                };
            }
            responseJSON(res, response);
            // 释放连接
            connection.release();

        });
    });
});

module.exports = router;