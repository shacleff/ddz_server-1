const TableManager = require("./table_manager");
function Game(id, gameName) {
	this.gameId = id;// 1 -> ddz
	this.gameName = gameName;
}

let proto = Game.prototype;

proto.onMsg = function(msg) {
	let cmd = msg['cmd'];
	console.log("game on msg");
	console.log(msg);
    let tableId = msg['tableId'];

    let table = TableManager.getTableById(tableId);
	
	if (table) {
        table.onMsg(msg);
	} else {
		console.error('...');
	}
};

// 其他接口
module.exports = Game;

