//这是content_scripts
/**
	如果元素被打码了，则拥有nowblur类，
	如果元素打码后又被取消了，先拥有nowclear类，
	然后失去nowblur和nowclear类
 */
//BEGIN
$(function () {
	$(document).mousedown(function (e) { // 在页面任意位置点击而触发此事件
		if (3 == e.which) {
			if ($(e.target).hasClass("nowblur")) {
				$(".willclear").removeClass("willclear"); //元素已被加滤镜，准备去滤镜
				$(e.target).addClass("willclear");
			} else {
				$(".willblur").removeClass("willblur"); //元素尚未加滤镜，准备加滤镜
				$(e.target).addClass("willblur");
			}
		}

	})

	//消息传递，监听接收次数
	var listenertime = 0;

	//接收来自插件的消息
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
		listenertime++;
		//单击模糊按钮会触发该事件
		if (request.channelmsg != undefined) {
			blurvalue = Number(request.channelmsg);
			//对将要加滤镜的元素做滤镜处理
			$(".willblur").addClass("nowblur");
			$(".nowblur").css({
				"-webkit-filter" : "blur("+blurvalue+"px)"
			});
			$(".nowblur").removeClass("willblur");

			//对将要去滤镜的元素取消滤镜
			$(".willclear").addClass("nowclear");
			$(".nowclear").css({
				"-webkit-filter" : "none"
			});
			$(".nowclear").removeClass("willclear");

			//如果元素加了滤镜，又去了滤镜则把元素还原为初始状态
			$(".nowblur.nowclear").removeClass("nowblur").removeClass("nowclear");

			console.log("第"+listenertime+"次" + "\n" + request.channelmsg);
		}
		//单击取消模糊按钮会触发该事件
		if(request.cmd != undefined && request.cmd == "cancel"){
			console.log("cmd: cancel");
			$(".nowblur").css({
				"-webkit-filter" : "none"
			}).removeClass("nowblur").removeClass("nowclear").removeClass("willblur").removeClass("willclear");
		}

		//更改模糊值会触发该事件
		if(request.cmd != undefined && request.channelmsg != undefined){
			blurvalue = request.channelmsg;
			console.log(request.cmd+" "+blurvalue);
			$(".nowblur").css({
				"-webkit-filter" : "blur("+blurvalue+"px)"
			});
		}
		
	});
});