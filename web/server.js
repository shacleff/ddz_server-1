const app = require("./app");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const EventDispatcher = require("../common/event_dispatcher");
const Session = require("../common/session");
const EventType = require("../common/event_type");
const LOG = require("../log/jl_log");
const config = require('./config');

function Server(port) {

    this.port = port;

    this.session = {};
}

let proto = Server.prototype;

proto.start = function () {

    server.listen(this.port,config.server.host);
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
        socket.on("disconnect", function () {
            EventDispatcher.trigger(EventType.MSG_DDZ_PLAYER_DISCONNECT, session);
            console.log("player disconnect");

        });
        
    });
};
module.exports = Server;