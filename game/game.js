const TableManager = require("./table_manager");
const EventType = require("../common/event_type");
const EventDispatcher = require("../common/event_dispatcher");
const PlayerManager = require("../common/player_manager");

function Game(id, gameName) {
    this.gameId = id;// 1 -> ddz
    this.gameName = gameName;
}

let proto = Game.prototype;

proto.onMsg = function (msg) {
    console.log(TableManager);
    let tableId;
    if (msg['tableId']) {
        tableId= msg['tableId'];
    } else if (msg["playerId"]) {
        let player = PlayerManager.getPlayerById(msg["playerId"]);
        tableId = player.tableId;
    }
    let table = TableManager.getTableById(tableId+"");

    if (table) {
        table.onMsg(msg);
    } else {
        console.error('no table...');
    }
};

// 其他接口
module.exports = Game;

