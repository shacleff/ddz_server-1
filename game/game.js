var TableManager = require("./table_manager");
function Game(id, gameName) {
	this.gameId = id;// 1 -> ddz
	this.gameName = gameName;
}

var proto = Game.prototype;

proto.onMsg = function(msg) {
	var cmd = msg['cmd'];
	var tableId = msg['tableId'];
	
	var table = TableManager.getTableById(1);
	
	if (table) {
		talbe.onMsg(msg);
	} else {
		console.error('...');
	}
}
// 其他接口

