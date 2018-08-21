var Table;
var PokerSets = require("../poker/poker_sets");
/**
* 下面只是一个简单的模板，实际需要更多的接口
* 这是游戏的主要的业务逻辑的处理！
*/
(function(Table) {
	
	function Table(type, id) {
		this._type = type; // 桌子类型
		this._id = id; // 全局唯一的桌子ID
		this.pokers = new PokerSets(1,true);//生成一副牌，带大小王
		
		this._playerList = {};
	}
	
	var proto = Table.prototype;
	
	proto.onMsg = function(msg) {
		// 所有的桌子接受的消息都投递到这个借口
		var cmd = msg[cmd];
		
		switch(cmd) {
			case 'discard': 
			// 出牌
			break;
			case 'pass':
			// 不要
			break;
			case 'prepare':
			// 准备
			break;
			// 可以添加更多相关的接口
			case '':
			break;
		}
	},
	
	proto.broadcastMsg = function(idList, msg) {
		// 根据idList找到所有的玩家，并广播消息
	},
	
	proto.startGame = function() {
		// 游戏开始
	},
	
	proto.endGame = function() {
		// 游戏结束，开始结算
	},
	
	proto.dealPoker = function() {
		// 发牌
		return [];
	},
	proto.joinTable = function(player) {
		/**
		 * 玩家加入桌子的入口
		 * 1. 这是玩家进入桌子的唯一入口
		 * 2. 将玩家加入玩家列表(this._playerList)；
		 * 3. 不能直接从外部直接将玩家加入_playerList
		 */
	},
	proto.leaveTable = function(player) {
		/**
		* 玩家离开桌子的接口
		* 1. 任何玩家想要离开桌子，必须通过该方法
		* 2. 不能直接从外部直接将玩家从_playerList中移除！！
		*
		*/
	},
	
	proto.startTimer = function(callback, interval, repeat, delay) {
		// 启动一个定时器
		var timer = new Timer();	// Timer也是一个基础类，可以找下js有没有一些好的类库，已经封装了Timer,也可以用setTimerout, setInterval自己封装下
		// 用来做超时处理
		
		return  timer;
	},
	proto.killTimer = function(timer) {
		// 杀掉一个timer
	}
	
	Table = Table;
	
})(Table || (Table = {}));

module.exports = Table;