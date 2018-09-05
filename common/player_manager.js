let Player = require("./player");
let EventDispatcher = require("./event_dispatcher");
const EventType = require("./event_type");
const Game = require("../game/game");
const md5 = require("md5");
const LOG = require("../log/jl_log");
const Global = require("../game/table_manager");
const ERROR_CODE = require("./error_code");

let Gp;

(function (Gp) {
    function PlayerManager() {

    }

    PlayerManager.prototype = {
        game: null,
        players: {},

        init: function () {
            this.game = new Game(1, "ddz");
            EventDispatcher.listen(EventType.MSG_DDZ_PLAYER_CONNECTED, this.onCreatePlayer, this);
            EventDispatcher.listen(EventType.MSG_DDZ_PLAYER_DISCONNECT, this.game.onDisconnect,this);

        },
        onCreatePlayer: function (session) {
            //
            LOG.Debug('connection incoming!');
            let player = new Player(session);
            this.players[player.socketId] = player;

            LOG.Debug('player.name: ' + player.getName() + ' player.accountId: ' + player.accountId);
            player.register(EventType.MSG_DDZ_REGISTER, this.playerRegister, this);
            player.register(EventType.MSG_DDZ_LOGIN, this.onPlayerAuth, this);
        },

        playerRegister: function (msg, player) {
            LOG.Debug("playerRegister");
            let cmd = msg['cmd'];
            let response = {};
            if (cmd !== 'register') {
                response['error_code'] = ERROR_CODE.CMD_ERROR; // cmd error
            } else {
                response['error_code'] = ERROR_CODE.SUCCESS;
                let username = msg['username'];
                let password = msg['password'];
                let token = msg['token'];
                let socketId = msg["socketId"];

                if (player.socketId !== socketId) {
                    response['error_code'] = ERROR_CODE.PLAYER_DOES_NOT_EXIST; // player not exists
                } else {
                    if (player.socketId !== token) {
                        response["error_code"] = ERROR_CODE.TOKEN_ERROR;//token 不一致
                    } else {
                        if (password.length === 0 || username.length === 0) {
                            response['error_code'] = ERROR_CODE.USERNAME_OR_PASSWORD_INCORRECT; // password or username error
                        } else {
                            if (password.length > 12) {
                                response["error_code"] = ERROR_CODE.PASSWORD_TOO_LONG;//密码太长
                            } else {
                                while (password.length < 12) {
                                    password += " ";
                                }
                                let pwdToken = password + token;
                                let pwdMd5 = md5(password);
                                LOG.Debug("pwd + Token: " + pwdToken + " pwdMd5: " + pwdMd5);
                                player.setPassword(pwdMd5);
                                player.setName(username);
                                response['player_info'] = this.packPlayerInfo(player);
                                response["tables"] = global.tableManager.getAllTables();
                                this.onAutherror_code(player);
                            }
                        }
                    }
                }
            }

            player.sendMsg("RESP_DDZ_REGISTER", response);
            LOG.Debug("send resp ddz _register");
            setTimeout(function () {
                player.sendMsg(EventType.MSG_DDZ_ALL_TABLES, {tables: [0, 1, 2, 3, 4]});

            }, 2000);
        },

        onAutherror_code: function (player) {
            this.initPlayer(player);
            player.register(EventType.MSG_DDZ_ENTER_TABLE, this.game.onMsg);
            player.register(EventType.MSG_DDZ_PLAYER_PREPARED, this.game.onMsg);
            player.register(EventType.MSG_DDZ_DISCARD, this.game.onMsg);
            player.register(EventType.MSG_DDZ_PASS, this.game.onMsg);
            player.register(EventType.MSG_DDZ_ALL_TABLES, this.game.onMsg);
            player.register(EventType.MSG_DDZ_GAME_OVER, this.game.onMsg);
            player.register(EventType.MSG_DDZ_PLAYER_LEAVE, this.game.onMsg);

        },
        onPlayerAuth: function (msg, player) {
            let cmd = msg["cmd"];
            let username = msg["username"];
            let password = msg["password"];
            let token = msg["token"];
            let socketId = msg["socketId"];
            let response = {};
            if (cmd !== "login") {
                response["error_code"] = ERROR_CODE.CMD_ERROR;//cmd error
            } else {
                if (player.socketId !== socketId) {
                    response["error_code"] = ERROR_CODE.USER_DOES_NOT_EXIST;//player doesnot exit
                } else {
                    if (token !== player.socketId) {
                        response["error_code"] = ERROR_CODE.TOKEN_ERROR;
                    } else {
                        if (username !== player.getName()) {
                            response['error_code'] = ERROR_CODE.USERNAME_OR_PASSWORD_INCORRECT; // name error
                        } else {
                            if (player.getPassword() !== md5(password)) {
                                response["error_code"] = ERROR_CODE.USERNAME_OR_PASSWORD_INCORRECT;//密码不正确
                            }
                            else {
                                LOG.Debug("login error_codeess");
                                response["error_code"] = ERROR_CODE.SUCCESS;
                                response['player_info'] = this.packPlayerInfo(player);
                                response["tables"] = global.tableManager.getAllTables();
                                this.onAutherror_code(player);
                            }
                        }
                    }
                }
            }

            player.sendMsg("RESP_DDZ_LOGIN", response);
            LOG.Debug("resp ddz login");
        },

        packPlayerInfo: function (player) {
            return {name: player.getName(), gender: player.getGender(), coin: player.getCoin()};
        },
        getPlayerById(id) {
            return this.players[id];
        },
        addPlayer(player) {
            this.players[player.socketId] = player;
        },
        getPlayers(ids) {
            let players = [];
            for (let i = 0, len = ids.length; i < len; i++) {
                players.push(this.players[ids[i]]);
            }
            return players;
        },
        getAllPlayers() {
            let players = [];
            for (let i in this.players) {
                players.push(this.players[i]);
            }
            return players;
        },


        initPlayer: function (player) {
            player.setName(this._getRandomName());
            player.setGender("FEMALE");
        },


        _getRandomName: function () {

            let name = '';

            for (let i = 0; i < 6; i++) {
                let rdm = Math.floor(Math.random() * (0x8fa5 - 0x4e00)) + 0x4e00;
                name += String.fromCharCode(rdm);
            }

            return name;
        }
    };
    Gp.PlayerManager = PlayerManager;
})(Gp || (Gp = {}));

module.exports = Gp;
