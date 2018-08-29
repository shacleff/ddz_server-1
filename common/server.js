const TableManager = require("../game/table_manager");
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const EventDispatcher = require("./event_dispatcher");
const Session = require("./session");
const Player = require("./player");
const EventType = require("./event_type");
const Game = require("../game/game");


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
    let game = new Game(1,"ddz");
    io.on('connection', function (socket) {

        // var clientIp = socket.getClientIp();    // ip + port
        // var clientMACaddr = socket.getMACsocket();
        socket.emit("yourid", {id: socket.id});//给客户端发送其socket.id，使其创建对应的player
        console.log(socket.id);
        let session = new Session(socket);
        // dict
        self.session[session.id] = session;
        let player = new Player(session);
        console.log("player connected...");
        player.register(EventType.MSG_DDZ_ENTER_TABLE, game.onMsg);
        player.register(EventType.MSG_DDZ_DISCARD,game.onMsg);
        player.register(EventType.MSG_DDZ_PASS, game.onMsg);
        player.register(EventType.MSG_DDZ_ALL_TABLES, game.onMsg);
        player.register(EventType.MSG_DDZ_GAME_OVER, game.onMsg);
        let tables = TableManager.getAllTables();
        socket.emit(EventType.MSG_DDZ_ALL_TABLES,{tables:tables});
        EventDispatcher.trigger(EventType.MSG_DDZ_PLAYER_CONNECTED, player);

    });
};
module.exports = Server;
