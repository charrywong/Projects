//这是选项页面的js
$(function () {
	disableExtension = Number(localStorage["BLURDisabled"]);
	selectedChannel = localStorage["BLURChannel"] || '1';
	
	//根据插件可用参数，来设置插件设置页面的外观
	if(disableExtension===1){
		$("#checkbox").attr("checked",false);
		$("fieldSet").attr("disabled",true).toggleClass("disabled");
		$("#cancel").toggleClass("btns");
	}
	else
	{
		$("#checkbox").attr("checked",true);
	}
	
	//根据插件频道参数，来设置复选框
	$("li input").each(function(){
		console.log($(this).val());
		if($(this).val()==selectedChannel)
		{
			$(this).click();
		}
	});
	
	//处理开启按钮的点击事件
	$("#checkbox").click(function(){
		disableExtension = Number(localStorage["BLURDisabled"]) === 1 ? 0 : 1;
		localStorage["BLURDisabled"] = disableExtension;
		chrome.extension.getBackgroundPage().updateQTExtension();
		
		if(disableExtension===1){
			$("#checkbox").attr("checked",false);
			$("fieldSet").attr("disabled",true).toggleClass("disabled");
			$("#cancel").toggleClass("btns");
		}else{
			$("#checkbox").attr("checked",true);
			$("fieldSet").attr("disabled",false).toggleClass("disabled");
			$("#cancel").toggleClass("btns");
		}
	});
	
	//处理模糊选项的点击事件
	$("li input").click(function(){
		localStorage["BLURChannel"] = $(this).val();
		chrome.extension.getBackgroundPage().updateQTExtension();
		chrome.extension.getBackgroundPage().tellContentChange();
	});
	
	//处理取消模糊元素点击事件
	$("#cancel").click(function(){
		sendCmd("cancel");
	});
	
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
						"cmd" : optionmsg
					});
			}
		});
	}
	
});