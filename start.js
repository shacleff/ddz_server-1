const Log =require("./common/Log");
const MyServer = require('./web/server');
const Global = require("./game/table_manager");
const Gp = require("./common/player_manager");


function init() {
    let tableManager = new Global.TableManager();
    let playerManager = new Gp.PlayerManager();

    global.tableManager = tableManager;
    global.tableManager.init();
    global.playerManager = playerManager;
    global.playerManager.init();
    let port = 3001;
    let myServer = new MyServer(port);
    myServer.start();
    Log.info("服务器启动...")
}

// init
init();




