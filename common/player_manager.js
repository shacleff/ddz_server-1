let Player = require("./player");
let EventDispatcher = require("./event_dispatcher");
const EventType = require("./event_type");

let PlayerManager = {
    //game:0,
    players: {},
    init: function () {
        EventDispatcher.listen(EventType.MSG_DDZ_PLAYER_CONNECTED, this.addPlayer, this);
    },
    onCreatePlayer: function (session) {
    },
    getPlayerById(id) {
        return this.players[id];
    },
    addPlayer(player){
        this.players[player.socketId]=player;
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
