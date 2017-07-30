var express = require('express'),
    app = express(),
    path = require('path'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = [],
    roomInfo = {outside:[]},
    socketJson = [];
var handlebars = require('express-handlebars').create({
    defaultLayout:'main',
});
io.set('log level', 1);
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//specify the html we will use
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('body-parser')());
/**********
 * 我的路由
 * *******/
app.get('/',function (req,res) {
    //res.json({a:10});
    res.render('index');
});

app.get('/test',function (req,res) {
    //res.json({a:10});
    res.render('test');
});

app.get('/all_rooms',function (req,res) {
    res.json(roomInfo);
});

app.get('/sockets',function (req,res) {
    res.json(socketJson);
});

app.get(/\/room\/([\w]+).*/,function (req,res) {
    res.render('index');
});
/***********
 * 路由结束
 **********/
function getRoomID(socket){
    var url = socket.handshake.headers.referer,
        id_res = url.match(/^.*\/room\/([\w]+).*/),
        roomID;
    if(id_res){
        roomID = id_res[1];
    }else {
        roomID = 1000;
    }
    return roomID;
}

//server.listen(3000);//for local test
server.listen(process.env.PORT || 3114);
//handle the socket

io.on('connect', function (socket) {
    var roomID = getRoomID(socket);
    console.log('get room id:',roomID);

    socket.join(roomID);
    console.log('room id and num of users:',roomID,roomInfo[roomID]);

    //房间情况
    if(roomInfo[roomID]>=2){
        socket.emit('system',{status:'1',msg:"房间已经满了，只能观战！"});
        roomInfo.outside.push(socket.id);
        console.log("outside:",roomInfo);
        socket.to(roomID).emit('system',{status:'0',msg:'1人前来观战！'+roomID});
        console.log('fuuuuuuull');
    }else {
        if (roomID in roomInfo) {
            socket.emit('system',{status:'0',msg:'加入房间'+roomID});
            socket.to(roomID).emit('system',{status:'0',msg:'1人加入房间'+roomID});
        }
    }

    if (roomID in roomInfo){
        roomInfo[roomID]++;
    }else {
        roomInfo[roomID] = 1;
    }

    socket.on('disconnect', function() {
        var roomID = getRoomID(socket);
        roomInfo[roomID]--;
        socket.to(roomID).emit('system',{status:'0',msg:'1人离开房间'+roomID});
        if(roomInfo[roomID] <= 2){
            socket.to(roomInfo.outside[0]).emit('system',{status:'2',msg:'轮到你玩了！'});
        }
        for (var i in roomInfo.outside){
            if(roomInfo.outside[i] === socket.id)   roomInfo.outside.splice(i, 1);
        }
    });

    //on new message
    socket.on('postMsg', function(msg) {
        var roomID = getRoomID(socket);
        socket.to(roomID).emit('newMsg', {msg:msg,user:socket.id,notMe:false});
    });

    //chess move
    socket.on('postMove', function(msg, color) {
        var roomID = getRoomID(socket);
        io.sockets.to(roomID).emit('newMove', 1, msg);
    });

});
