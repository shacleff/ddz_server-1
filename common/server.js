const TableManager = require("../game/table_manager");
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const EventDispatcher = require("./event_dispatcher");
const Session = require("./session");
const Player = require("./player");
const EventType = require("./event_type");
const LOG = require("../log/jl_log");
const axios = require("axios");
function Server(port) {

    this.port = port;

    this.session = {};
}

let proto = Server.prototype;

proto.start = function () {

    server.listen(this.port);
    this.init();
};
proto.stop = function () {
    server.stop();
};
proto.init = function () {
    let self = this;


    io.on('connection', function (socket) {
        console.log("socket connection established...");
        // var clientIp = socket.getClientIp();    // ip + port
        // var clientMACaddr = socket.getMACsocket();
        socket.emit("yourid", {id: socket.id});//给客户端发送其socket.id，使其创建对应的player
        // console.log(socket.id);
        let session = new Session(socket);
        // dict
        self.session[session.id] = session;
        EventDispatcher.trigger(EventType.MSG_DDZ_PLAYER_CONNECTED, session);

        //socket.emit(EventType.MSG_DDZ_ALL_TABLES,{tables:tables});
        // LOG.Debug("all tables");
        // EventDispatcher.trigger(EventType.MSG_DDZ_PLAYER_CONNECTED, player);

    });
};
module.exports = Server;