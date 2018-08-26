const MyServer = require('./common/server');
const PlayerManager = require("./common/player_manager");
const TableManager = require("./game/table_manager");
const PokerData = require('./poker/Poker');


function init() {
    TableManager.init();
    PlayerManager.init();
    let port = 3001;
    let myServer = new MyServer(port);
    myServer.start();
    console.log('server start success');
}

// init
init();




