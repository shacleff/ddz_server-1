let Player = require("./player");
let EventDispatcher = require("./event_dispatcher");

let PlayerManager = {
    players: {},
    init: function () {
        EventDispatcher.listen("MSG_DDZ_PLAYER_CONNECTED", this.onCreatePlayer, this);
    },
    onCreatePlayer: function (session) {
        let player = new Player(session);
        this.players[player.socketId] = player;
        console.log("player is coming...");
        player.sendMsg("MSG_DDZ_PLAYER_CONNECTED", {cmd: "connected success"});
    },
};

module.exports = PlayerManager;
