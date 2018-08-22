var Table = require('./table');

/**
* 这是一个桌子管理器
*/
var TableManager = {
	ID: 0,
	// _tables: {},
	_tables: [],
	// 可以在app.js中初始化
	init: function () {
		// 这里可以在服务器启动时直接创建出很多桌子。
		console.log("init table manager");
		for (var i = 0; i < 100; i++) {
			var type = 0, id = this._generatedId();
			this._createTable(type, id)
			this.addTable(this._createTable(type, id));
		}
	},
	addTable: function (table) {
		// 添加一个桌子
		this._tables.push(table);
	},

	getTableById: function (id) {
		//return a table;
	},

	getTableByRandom: function () {
		// return a table;
	},

	_createTable: function (type, id) {
		var table = new Table(type, id);
		return table;
	},


	_generatedId: function () {
		/**
		* 其实可以封住一个IBaseElement。这个类提供这个方法。任何需要唯一ID的类都从这个类继承
		*/
		var id = TableManager.ID;
		TableManager.ID++;	// 这种做法仅限于是单线程！！！！
		return id;
	}

};

module.exports = TableManager;