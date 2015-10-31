//这是背景页的代码

(function (global) {

	/**localStorage value type is always string, we should convert it into number when need*/
	var currentChannel = Number(localStorage["BLURChannel"]) || 1;
	var disableExtension = Number(localStorage["BLURDisabled"]) || 0;

	//创建右键菜单
	var contextMenuId = chrome.contextMenus.create({
			"title" : "模糊处理",
			"contexts" : ["all"]
		});

	//监听右键菜单，一旦被点击，则通知前台
	chrome.contextMenus.onClicked.addListener(function (tab) {
		var transstorage = currentChannel;
		// Send a message to the active tab
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function (tabs) {
			var activeTab = tabs[0];
			//chrome.tabs.sendMessage(activeTab.id, {"message": transstorage});
			for (var i = 0; i < 1; i++) {
				chrome.tabs.sendMessage(activeTab.id, {
						"channelmsg" : transstorage
					});
			}
		});
	});

	//更新参数
	function updateExtensionStatus() {
		chrome.browserAction.setIcon({
			path : "icons/icon48" + (disableExtension ? "_disabled" : "") + ".png"
		});

		/**create or remove chrome context menus*/
		if (disableExtension === 1) {
			typeof contextMenuId !== 'undefined' && chrome.contextMenus.remove(contextMenuId);
			/*typeof contextMenuId!=='undefined'&&chrome.contextMenus.remove(contextMenuId, function () {
			alert("menu removed");
			});*/

			contextMenuId = undefined;
		} else {
			if (contextMenuId == undefined) {
				contextMenuId = chrome.contextMenus.create({
						"title" : "模糊处理",
						"contexts" : ["all"]
					});
			}

		}
	}

	//该方法会在设置值发生改变的时候进行调用
	global.updateQTExtension = function () {
		currentChannel = Number(localStorage["BLURChannel"]) || 1;
		disableExtension = Number(localStorage["BLURDisabled"]);
		updateExtensionStatus();
		console.log("current channel："+currentChannel);
	};

	global.tellContentChange = function () {
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function (tabs) {
			var activeTab = tabs[0];
			//chrome.tabs.sendMessage(activeTab.id, {"message": transstorage});
			for (var i = 0; i < 1; i++) {
				chrome.tabs.sendMessage(activeTab.id, {
						"cmd" : "changepx",
						"channelmsg":currentChannel
					});
			}
		});
	};
	
	updateExtensionStatus();
})(window);