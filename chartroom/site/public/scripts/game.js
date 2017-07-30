/**
 * Created by mimig on 2017/7/23.
 */
$(function () {
    var hichat = new HiChat();
    hichat.init();
});
var HiChat = function() {
    this.socket = null;
};
HiChat.prototype = {
    init: function() {
        var that = this;
        this.socket = io.connect();
        this.socket.on('connect', function () {
            console.log("connect success!");
            console.log(that.socket.id)
        });
        this.socket.on('newMsg', function (msg) {
            that._disPlayUserMsg('网友',msg.msg);
        });
        this.socket.on('system', function (info) {
            console.log('receive:', info);
            switch (info.status)
            {
                case '1':
                    that._disabledMove();
                    break;
                case '2':
                    that._enabledMove();
                    break;
                default:
                    break;
            }
            that._disPlaySysNewMsg('系统',info.msg);

        });
        this.socket.on('newMove', function (stats, msg) {
            console.log('receive:', msg);
            that._moveChess(that, msg);
            //that._enabledMove();
        });
        $(".black,.white").draggable({
            revert: "invalid"
        });
        $(".empty").droppable({
            drop: that._dropFunc(that),
        });
        $("#sendBtn").on('click', function () {
            var msg = $("#messageInput").val();
            $("#messageInput").val('');
            that._disPlayUserMsg('我',msg);
            that.socket.emit('postMsg',msg);
        });
        $("body").keydown(function() {
            if (event.keyCode == "13") {//keyCode=13是回车键
                $('#sendBtn').click();
            }
        });
    },
    _dropFunc:function(that) {
        var connection = that;
        //this.socket.emit('img', e.target.result, color);
        //or return {}
        return function (event, ui) {
            var color = ui.draggable.hasClass('black') ? 'black' : 'white';
            var start = ui.helper.attr('No');
            var stop = $(this).attr('No');
            $('<div class="cell empty ui-droppable" No="'+start+'"></div>').replaceAll($(ui.helper));
            $('<div class="cell ' + color + '" No="'+stop+'"></div>').replaceAll($(this));
            $("." + color).draggable({
                revert: "invalid"
            });
            $(".empty").droppable({
                drop: connection._dropFunc(connection),
            });
            msg = {
                start: start,
                stop: stop,
                color: color
            };
            console.log('send:',msg);
            connection.socket.emit('postMove',msg, color);
        }
    },
    _moveChess:function (connection,msg) {
        var start = msg.start,
            stop = msg.stop,
            color = msg.color;
        $('<div class="cell empty ui-droppable" No="' + start + '"></div>').replaceAll($('.cell[No$='+start+']'));
        $('<div class="cell ' + color + '" No="' + stop + '"></div>').replaceAll($('.cell[No$='+stop+']'));
        $("." + color).draggable({
            revert: "invalid"
        });
        $(".empty").droppable({
            drop: connection._dropFunc(connection),
        });
    },
    _disPlaySysNewMsg: function(user,msg) {
        var date = new Date().toTimeString().substr(0, 8);
        $('<p>').html(user + '<span class="timespan">(' + date + '): </span>' + msg)
            .appendTo($('#historyMsg'))
        $('#historyMsg').scrollTop($('#historyMsg')[0].scrollHeight);
    },
    _disPlayUserMsg: function(user,msg) {
        var date = new Date().toTimeString().substr(0, 8);
        $('<p>').html(user + '<span class="timespan">(' + date + '): </span>' + msg)
            .appendTo($('#historyMsg'))
        $('#historyMsg').scrollTop($('#historyMsg')[0].scrollHeight);
    },
    _disabledMove: function() {
        $('#cover').css({
            'width': $('#panel').width(),
            'position': 'absolute',
            'height': $('#panel').height(),
            'opacity': 0.1,
            'z-index': 100,
            'top':$('#panel').offset().top,
            'left':$('#panel').offset().left,
            'display':'block'
        });
    },
    _enabledMove: function() {
        $('#cover').hide();
    },
};