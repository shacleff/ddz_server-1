function Player(session) {
    this.socket = session;
    this.socketId = this.socket.id;
    this.accountId = Player.ID;
    Player.ID++;

    this.nickName = "jdakfdja;";
    this.coin = Math.random() * 10000;
    this.gender = Player.GENDER.SECRET;
}

Player.prototype = {
    sendMsg: function (cmd, msg) {
        this.socket.emit(cmd, msg);
    },
    joinTable: function (tableId) {
        this.socket.join(tableId);
    },

    register: function(cmd, callback) {
        console.log("player register");
        var self = this;
        this.socket.on(cmd, function(data) {
            if (callback) {
                console.log(data);
                callback(data,self);
            }
        });
    },
};
//删除已经出了的牌
Player.prototype.del_poker = function (pokerToDel) {
    for (let i = 0; i < pokerToDel.length; i++) {
        for (let j = 0; j < this.poker.length; j++) {
            if (pokerToDel[i]['showTxt'] === this.poker[j]['showTxt'] &&
                pokerToDel[i]['showType'] === this.poker[j]['showType']) {
                this.poker.splice(j, 1);
            }
        }
    }
};
Player.ID = 0;
Player.GENDER = {
  MALE: 1,
  FEMALE: 2,
  SECRET: 3
};
module.exports = Player;