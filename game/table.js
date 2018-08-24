const PokerSets = require("../poker/poker_sets");
const Util = require("../poker/util");
// const Player = require("../common/player");
const EventDispatcher = require("../common/event_dispatcher");
const PlayerManager = require("../common/player_manager");
const EventType = require("../common/event_type");


/**
 * 下面只是一个简单的模板，实际需要更多的接口
 * 这是游戏的主要的业务逻辑的处理！
 */
// (function (Table) {

function Table(type, id) {
    this._type = type; // 桌子类型
    this._id = id; // 全局唯一的桌子ID
    this.pokers = new PokerSets(1, true).getPokers();//生成一副牌，带大小王
    this._playerList = [];

}

let proto = Table.prototype;

Table.prototype.onMsg = function (msg) {
// 所有的桌子接受的消息都投递到这个借口
    var cmd = msg["cmd"];
    console.log("table onMsg" + JSON.stringify(msg));
    switch (cmd) {
        case 'discard':
            console.log("discard");
            this.discard(msg);
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
            this.joinTable(msg['player']);
            break;

    }
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
    for (var i = 0; i < this._playerList.length; i++) {
        this._playerList[i].sendMsg(EventType.MSG_DDZ_DEAL_POKER, this.threePlayerPokers[i]);
    }
    // return [];
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
        // 通过方法访问，getPlayerById(id) getPlayers(ids) getAllPlayer();
        // 不要通过属性访问
    let player = PlayerManager.getPlayerById(playerId);
    let all = [];
    for (let i = 0, len = this._playerList.length; i < len; i++) {
        all.push({index: i, player: this._playerList[i].accountId});
    }
    player.sendMsg(EventType.MSG_DDZ_ENTER_TABLE, {allPlayers: all});//发送给自己，信息为已连接的玩家
    this._playerList.push(player);
    player.joinTable(this._id);
    player.setTableId(this._id);
    let index = this._playerList.indexOf(player);
    console.log({index: index, player: player.accountId});
    //通知桌子内其他玩家，信息为本玩家的信息，以及位置
    player.broadcastMsg(player.tableId, EventType.MSG_DDZ_ENTER_TABLE, {index: index, player: player.accountId});

    if (this._playerList.length === 3) {
        this.startGame();
        console.log("人数已满,开始发牌");
        return;
    }


};
Table.prototype.discard = function (data) {
    console.log(data);
    let player = PlayerManager.getPlayerById(data["playerId"]);
    let seatId = this._playerList.indexOf(player);
    let msg = {
        seatId: seatId,
        pokers: data["pokers"]
    };
    player.broadcastMsg(player.tableId, EventType.MSG_DDZ_CHU_PAI, msg);
    //以下报错找不到此函数，找不到原因
    //this.broadcastMsg(id,EventType.MSG_DDZ_CHU_PAI, data);
};
Table.prototype.broadcastMsg = function (id, cmd, msg) {
    // 根据idList找到所有的玩家，并广播消息
    let player = PlayerManager.getPlayerById(id);
    player.broadcastMsg(player.tableId, cmd, msg);

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
