const PokerSets = require("../poker/poker_sets");
const Util = require("../poker/util");
// const Player = require("../common/player");
const EventDispatcher = require("../common/event_dispatcher");
const PlayerManager = require("../common/player_manager");

/**
 * 下面只是一个简单的模板，实际需要更多的接口
 * 这是游戏的主要的业务逻辑的处理！
 */
// (function (Table) {

function Table(type, id) {
    this._type = type; // 桌子类型
    this._id = id; // 全局唯一的桌子ID
    this.pokers = new PokerSets(1, true).getPokers();//生成一副牌，带大小王
    console.log(this.pokers.length+"poker ;enth");
    this._playerList = [];
}

let proto = Table.prototype;
Table.prototype.onMsg = function (msg) {

// 所有的桌子接受的消息都投递到这个借口
    var cmd = msg["cmd"];
    console.log("table onMsg"+JSON.stringify(msg));
// this._playerList = {};
    // 不要用字符串，其他地方容易写错
    EventDispatcher.listen("MSG_DDZ_ENTER_TABLE", this.joinTable, this);

    switch (cmd) {
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
        case 'start':
            this.startGame();
            break;
        case 'join':
            console.log(this._id);
            this.joinTable(msg['player']);
            break;

    }
};

Table.prototype.broadcastMsg = function (idList, msg) {
    // 根据idList找到所有的玩家，并广播消息
};

Table.prototype.startGame = function () {
    // 游戏开始
    this.dealPoker();
};

Table.prototype.endGame = function () {
    // 游戏结束，开始结算
};

Table.prototype.dealPoker = function () {
    // 发牌
    this.generatePokers();
    // 这个地方最好使用广播的借口，而且发送消息最好不要在这个‘发牌函数’内进行。‘发牌’就只做‘发牌’，未来可以添加其他的发牌机制，就只用修改这个方法就可以了
    for (var i = 0; i < 3; i++) {
        console.log(this.threePlayerPokers[i]);
        this._playerList[i].sendMsg("deal_poker", this.threePlayerPokers[i]);
    }
    return [];
};
Table.prototype.generatePokers = function () {
    this.threePlayerPokers = [];
    console.log(this.pokers);
    let allPokers = this.pokers;
    for (let i = 0; i < 2; i++) {//生成2个17张的扑克组合并放入3个玩家扑克的数组中
        let bodyPokerDataItem = [];
        for (let j = 0; j < 17; j++) {
            let num = Math.floor(Math.random() * (allPokers.length));//随机抽取
            let pokerData = allPokers[num];
            bodyPokerDataItem.push(pokerData);
            allPokers.splice(num, 1);//删除抽取的元素
        }
        this.threePlayerPokers.push(bodyPokerDataItem);
    }
    this.threePlayerPokers.push(allPokers);//把剩余的20张放入3个玩家扑克数组中，20张的为地主
    for (let i = 0; i < 3; i++) {//排序
        this.threePlayerPokers[i].sort(Util.gradeDown);
    }
};

Table.prototype.joinTable = function (playerId) {
    /**
     * 玩家加入桌子的入口
     * 1. 这是玩家进入桌子的唯一入口
     * 2. 将玩家加入玩家列表(this._playerList)；
     * 3. 不能直接从外部直接将玩家加入_playerList
     */
    console.log("jointable table"+this._playerList.length);
    console.log("table playerList length"+this._playerList.length);
    // 通过方法访问，getPlayerById(id) getPlayers(ids) getAllPlayer();
    // 不要通过属性访问
    var player = PlayerManager.players[playerId];
    player.joinTable(this._id);
    this._playerList.push(player);
    if (this._playerList.length ===3) {
        this.startGame();
        console.log("人数已满");
        return;
    }


};
Table.prototype.leaveTable = function (player) {
    /**
     * 玩家离开桌子的接口
     * 1. 任何玩家想要离开桌子，必须通过该方法
     * 2. 不能直接从外部直接将玩家从_playerList中移除！！
     *
     */
};

Table.prototype.startTimer = function (callback, interval, repeat, delay) {
    // 启动一个定时器
    var timer = new Timer();	// Timer也是一个基础类，可以找下js有没有一些好的类库，已经封装了Timer,也可以用setTimerout, setInterval自己封装下
    // 用来做超时处理

    return timer;
};
Table.prototype.killTimer = function (timer) {
    // 杀掉一个timer
};

// Table = Table;

// })(Table || (Table = {}));

module.exports = Table;
