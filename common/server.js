
let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let EventDispatcher = require("./event_dispatcher");
let Session = require("./session");
function Server(port) {
    this.port = port;

    this.session = {};

}

let proto = Server.prototype;

proto.start = function() {
    server.listen(this.port);

    this.init();
};
proto.stop = function() {
    server.stop();
};
proto.init = function () {
    let self = this;
    io.on('connection', function(socket) {

        // var clientIp = socket.getClientIp();    // ip + port
        // var clientMACaddr = socket.getMACsocket();

        let session = new Session(socket);

        // dict
        self.session[session.id] = session;

        EventDispatcher.trigger("CREATE_SESSION", socket);
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
