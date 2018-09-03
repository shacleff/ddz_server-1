const EventType = require("../common/event_type");
const EventDispatcher = require("../common/event_dispatcher");
const PlayerManager = require("../common/player_manager");

function Game(id, gameName) {
    this.gameId = id;// 1 -> ddz
    this.gameName = gameName;
}

let proto = Game.prototype;

proto.onMsg = function (msg) {

    let tableId;
    if (msg['tableId']) {
        tableId = msg['tableId'];
    } else {
        if (msg["playerId"]) {
            let player = global.playerManager.getPlayerById(msg["playerId"]);
            tableId = player.tableId;
        }

    }

    let table = global.tableManager.getTableById(tableId);

    if (table) {
        table.onMsg(msg);
    } else {

        console.log("找不到桌子" + msg["tableId"]);
        console.error(msg);
    }
};

// 其他接口
module.exports = Game;

