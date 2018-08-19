let Player = require("./player");
let EventDispatcher = require("./event_dispatcher");

function PlayerManager() {
    this.players = {};
}

PlayerManager.prototype.init = function () {
    EventDispatcher.listen("CREATE_SESSION", this.onCreatePlayer, this);
};

PlayerManager.prototype.onCreatePlayer = function (session) {

    let player = new Player(session);

    this.players[player.accountId] = player;

    player.regsiter('test', function(data) {
        console.log(data);
    });

    console.log("player is coming...");
    player.sendMsg("test",{"test":"test"});
};
module.exports = PlayerManager;
