const TableManager = require("../game/table_manager");
const Game = require("../game/game");
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const EventDispatcher = require("./event_dispatcher");
const Session = require("./session");
const Player = require("./player");
const EventType = require("./event_type");

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
    let game = new Game(1, "ddz");
    io.on('connection', function (socket) {

        // var clientIp = socket.getClientIp();    // ip + port
        // var clientMACaddr = socket.getMACsocket();
        socket.emit("yourid", {id: socket.id});
        console.log(socket.id);

        let session = new Session(socket);

        // dict
        self.session[session.id] = session;
        let player = new Player(socket);
        player.register(EventType.MSG_DDZ_ENTER_TABLE, game.onMsg);
        player.register(EventType.MSG_DDZ_CHU_PAI, game.onMsg);
        EventDispatcher.trigger(EventType.MSG_DDZ_PLAYER_CONNECTED, socket);
        console.log("player connection is coming");

    });

    //
    // io.on('disconnect', function(socket) {
    //
    //     this.session.remove(socket.id);
    //
    //     common.EventDispatcher.trigger(common.EventType.PLAYER_DISCONNECT, session);
    //
    // });
    //
    // io.on('error', function() {
    //
    // });
};
module.exports = Server;

// function Session(socket) {
//     this.id = socket.id;
//     this.socket = socket;
// }
//
// Session.prototype.sendMsg = function(cmd, msg) {
//     io.to(this.socket.id).emit(cmd, msg);
// };
//
// Session.prototype.onMsg= function(cmd, msg) {
//     // io.on(this.socket.id).emit(cmd, msg);
// };
//
//
// function Player(session) {
//     this.session = session;
// }
//
// Player.prototype.sendMsg = function(cmd, msg) {
//     this.session.sendMsg(cmd, msg);
// };
//
// Player.prototype.onMsg= function(cmd, msg) {
//     this.session.onMsg(cmd, msg);
// };
//
// function PlayerManager () {
//     this.players = {};
// }
//
// PlayerManager.prototype.init = function() {
//     common.EventDispatcher.listen("CREATE_SESSION", this.onCreatePlayer, this);
// };
//
// PlayerManager.prototype.onCreatePlayer = function(session) {
//
//     let player = new Player(session);
//
//     this.players[player.id]  = player;
//
//     console.log("player is coming...");
// };
//
// common.PlayerManager = PlayerManager;
//
// //
// // NoticeManger.broadcast = function(idList, msg) {
// //     let players = playerManger.getPlaeyr(idList);
// //
// //     player.sendMsg()
// // };
