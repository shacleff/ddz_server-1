let Player = require("./player");
let EventDispatcher = require("./event_dispatcher");
const EventType = require("./event_type");
const TableManager = require("../game/table_manager");

let PlayerManager = {
    players: {},
    init: function () {

        EventDispatcher.listen(EventType.MSG_DDZ_PLAYER_CONNECTED, this.onCreatePlayer, this);
    },
    onCreatePlayer: function (session) {
        let player = new Player(session);
        this.players[player.socketId] = player;
        console.log("player is coming...");
        //player.sendMsg(EventType.MSG_DDZ_PLAYER_CONNECTED, {tables: [1,2,3]});
    },
    getPlayerById(id) {
        return this.players[id];
    },
    getPlayers(ids) {
        let players = [];
        for (let i = 0, len = ids.length; i < len; i++) {
            players.push(this.players[ids[i]]);
        }
        return players;
    },
    getAllPlayers() {
        let players = [];
        for (let i in this.players) {
            players.push(this.players[i]);
        }
        return players;
    },

};

module.exports = PlayerManager;
