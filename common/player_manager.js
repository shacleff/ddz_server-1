let Player = require("./player");
let EventDispatcher = require("./event_dispatcher");

function PlayerManager() {
    this.players = {};
}

PlayerManager.prototype.init = function () {
    EventDispatcher.listen("MSG_DDZ_PLAYER_CONNECTED", this.onCreatePlayer, this);
};

PlayerManager.prototype.onCreatePlayer = function (session) {

    let player = new Player(session);

    this.players[player.accountId] = player;

    player.regsiter('MSG_DDZ_ENTER_TABLE', function(data) {
        console.log(data);
    });

    console.log("player is coming...");
    player.sendMsg("MSG_DDZ_PLAYER_CONNECTED",{cmd:"connected success"});
};
module.exports = PlayerManager;
