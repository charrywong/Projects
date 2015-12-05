//这是背景页的代码

(function (global) {

	/**localStorage value type is always string, we should convert it into number when need*/
	var enableExtension = Number(localStorage["fanyienabled"]||1) || 0;
	//更新图标
	function updateExtensionStatus() {
		enableExtension = Number(localStorage["fanyienabled"]||1) || 0;
		chrome.browserAction.setIcon({
			path : "icons/icon48" + (enableExtension ?"":"_disabled") + ".png"
		});
	}

	//发送消息的方法
	function sendCmd(str){
		var optionmsg = str;
				// Send a message to the active tab
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function (tabs) {
			var activeTab = tabs[0];
			//chrome.tabs.sendMessage(activeTab.id, {"message": transstorage});
			for (var i = 0; i < 1; i++) {
				chrome.tabs.sendMessage(activeTab.id, {
						"enablevalue" : optionmsg,
						"tag":"optionpage"
				});
			}
		});
	}
	
	//该方法会在设置值发生改变的时候进行调用
	global.updateQTExtension = function () {
		updateExtensionStatus();
	};
	
	//打开页面时要执行一次
	updateExtensionStatus();
	
	//当内容脚本发送请求时，给出答复
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
		//listenertime++;
		//单击用户更改插件可用状态会触发该事件
		if (request.msg == "getLocalStorage") {
			sendCmd(enableExtension);
		}
	});
})(window);