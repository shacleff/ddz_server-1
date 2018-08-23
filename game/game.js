const TableManager = require("./table_manager");
const EventType = require("../common/event_type");
const EventDispatcher = require("../common/event_dispatcher");
function Game(id, gameName) {
	this.gameId = id;// 1 -> ddz
	this.gameName = gameName;
}

let proto = Game.prototype;

proto.onMsg = function(msg) {
	let cmd = msg['cmd'];
    let tableId = msg['tableId'];

    let table = TableManager.getTableById(tableId);
    // EventDispatcher.listen(EventType.MSG_DDZ_ENTER_TABLE, table.joinTable, this);

    if (table) {
        table.onMsg(msg);
	} else {
		console.error('...');
	}
};

// 其他接口
module.exports = Game;

