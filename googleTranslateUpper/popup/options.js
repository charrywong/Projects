//这是选项页面的js
$(function () {
	enableExtension = Number(localStorage["fanyienabled"]||1)||0;
	
	//根据插件可用参数，来设置单选框的值
	if(enableExtension===1){
		$('[name="switchbtn"]').val(['1']);
	}
	else
	{
		$('[name="switchbtn"]').val(['0']);
	}
	
	//处理单选按钮的点击事件
	$('[name="switchbtn"]').click(function(){
		enableExtension = $(this).val();
		localStorage["fanyienabled"] = enableExtension;
		sendCmd(enableExtension);
		chrome.extension.getBackgroundPage().updateQTExtension();
	});
	
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
});