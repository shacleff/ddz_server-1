const MyServer = require('./common/server');
const PlayerManager = require("./common/player_manager");
const TableManager = require("./game/table_manager");
PlayerManager.init();
TableManager.init();


const PokerData = require('./poker/Poker');
function init() {
    let port = 3001;
    let myServer = new MyServer(port);
    myServer.start();
    console.log('server start success');
}

// init
init();

function handoutPoker(players) {
    let pai = null;
    let dt = null;
    // PokerData.load();//随机生成3个玩家的手牌
    let a = new PokerData();
    a.setPart();
    pai = a.partcards;//[[0],[1],[2]]得到3个玩家的手牌
    console.log(players);
    for (let i = 0; i < players.length; i++) {
        let num = Math.floor(Math.random() * (pai.length));
        dt = pai[num];
        players[i].poker = dt;
        if (dt.length === 20) {
            players[i].team = 1;
            players[i].status = true;
        }
        pai.splice(num, 1);
        console.log('id:' + players[i].id);
        io.to(players[i].id).emit('start', players[i]);//发牌事件
    }
}

// globa.init = function() {
//     io.on(globa.CMD.DDZ_CREATE_ROOM, createRoom);
// };
// function createRoom(para) {
//     // chuli
// }

// io.on('connection', function (socket) {
//     console.log('用户连接上');
//     let player = new Player(socket.id, [], false);
//     io.to(socket.id).emit("rooms", rooms);
//     socket.on('create room', function (data) {
//         console.log("create room");
//         a++;
//         let roomID = '房间' + a;   // 获取房间ID
//         if (!rooms[roomID]) {
//             rooms[roomID] = [];
//         }
//         rooms[roomID].push(player);
//         socket.join(roomID);    // 加入房间
//         //io.sockets.emit("rooms", rooms);
//         io.sockets.emit("rooms", rooms);
//         console.log(rooms);
//         setTimeout(function() {
//             io.to(socket.id).emit("create room", {msg:'aaa'});
//         }, 2000);
//
//     });
//     //加入房间
//     socket.on('jointable', function (data) {
//         let roomID = data['name'];   // 获取房间ID，此处为前端点击的列表中的房间名称
//         socket.join(roomID);
//         console.log(socket.id + ' 加入了房间 ' + roomID);
//         io.to(socket.id).emit("jointable", {'tablename': "jiangdianchang"});
//         rooms[roomID].push(player);
//         if (rooms[roomID].length === 3) {//连接的用户数为3时开始发牌
//             console.log('开始发牌');
//             target[roomID] = {};
//             setTimeout(function () {
//                 handoutPoker(rooms[roomID]);
//             }, 2000);
//         }
//     });
//     socket.on('disconnect', function () {
//         // players = [];
//         // rooms = {};
//         // a = 0;
//         // let room = Object.keys(socket.rooms)[1];
//         // console.log(room);
//         // console.log(rooms);
//         // socket.leave(room);
//         // if (rooms[room]) {
//         //     for (let j = 0; j < rooms[room].length; j++) {
//         //         if (socket.id === rooms[room][j].id) {
//         //             rooms[room].splice(j, 1);
//         //             console.log(socket.id + "断开了");
//         //         }
//         //     }
//         // }
//         // if (!rooms[room]) {
//         //     delete rooms[room];
//         //     console.log('shanchu');
//         // }
//
//     });
//     //出牌
//     socket.on('play poker', function (data) {
//
//         let room = Object.keys(socket.rooms)[1];
//         target[room].id = socket.id;
//         target[room].list = data;
//         let isPlaying = true;
//         for (let i = 0; i < rooms[room].length; i++) {
//             if (socket.id === rooms[room][i].id) {
//                 rooms[room][i].del_poker(data);
//                 if (rooms[room][i].poker.length === 0) {
//                     console.log(socket.id + "队伍赢了！");
//                     io.to(room).emit("game over", {'win_team': rooms[room][i].team});
//                     isPlaying = false;
//                 }
//             }
//         }
//         if (isPlaying) {
//             orderHandler(room, target[room], rooms[room]);//让下家出牌
//         }
//     });
//     //不要牌
//     socket.on('dont follow', function (data) {
//         let room = Object.keys(socket.rooms)[1];
//         for (let j = 0; j < rooms[room].length; j++) {
//             if (rooms[room][j].id === socket.id) {
//                 if (j === 0 || j === 1) {
//                     io.to(room).emit('your turn', {
//                         "id": rooms[room][j + 1].id,
//                         'status': true,
//                         'list': target[room]['list'],
//                         'tid': target[room]['id']
//                     });
//                 } else {
//                     io.to(room).emit('your turn', {
//                         "id": rooms[room][j - 2].id,
//                         'status': true,
//                         'list': target[room]['list'],
//                         'tid': target[room]['id']
//                     });
//                 }
//             }
//         }
//     });
// });

//处理出牌顺序
function orderHandler(room, t, players) {
    for (let i in t) {
        if (i === 'id') {
            for (let j = 0; j < players.length; j++) {
                if (players[j].id === t[i]) {
                    if (j === 0 || j === 1) {
                        // io.to(players[j + 1].id).emit("your turn", true)
                        io.to(room).emit('your turn', {
                            "id": players[j + 1].id,
                            'status': true,
                            'list': t['list'],
                            'tid': t['id']
                        });
                    } else {
                        io.to(room).emit('your turn', {
                            "id": players[j - 2].id,
                            'status': true,
                            'list': t['list'],
                            'tid': t['id']
                        });

                    }
                }
            }
        }
    }
    // io.sockets.emit("play poker",t['list']);


}




