let Player = require("./player");
let EventDispatcher = require("./event_dispatcher");
const EventType = require("./event_type");
const TableManager = require("../game/table_manager");
const Game = require("../game/game");

let PlayerManager = {
    game:0,
    players: {},
    init: function () {
        this.game = new Game(1,"ddz");
        EventDispatcher.listen(EventType.MSG_DDZ_PLAYER_CONNECTED, this.onCreatePlayer, this);
    },
    onCreatePlayer: function (session) {
        let player = new Player(session);
        this.players[player.socketId] = player;
        console.log("player is coming...");
        player.register(EventType.MSG_DDZ_ENTER_TABLE, this.game.onMsg);
        player.register(EventType.MSG_DDZ_DISCARD, this.game.onMsg);
        player.register(EventType.MSG_DDZ_PASS, this.game.onMsg);
        player.register(EventType.MSG_DDZ_ALL_TABLES, this.game.onMsg);
        player.register(EventType.MSG_DDZ_GAME_OVER, this.game.onMsg);
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
