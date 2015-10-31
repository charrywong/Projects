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
	
	//动态模糊值框的赋值
	$("#shownum").text(localStorage["BLURdynamicnum"] || 5);
	$("#dynamicnum").val(localStorage["BLURdynamicnum"] || 5);
	
	//根据插件频道参数，来设置复选框
	$("li input").each(function(){
		console.log($(this).val());
		if($(this).val()==selectedChannel)
		{
			$(this).click();
		}
		else
		{
			if(selectedChannel>5)
			{
				$("#shownum").text(selectedChannel);
				$("#dynamicnum").val(selectedChannel);
				$("#dynamicnum").click();	
			}
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
	
	//增加模糊值
	$("#plus").click(function(){
		var num = parseInt($("#shownum").text());
		var nextnum = num+1;
		if(nextnum>=5 && nextnum<=20)
		{
			$("#shownum").text(nextnum);
			$("#dynamicnum").val(nextnum);
			localStorage["BLURdynamicnum"] = nextnum;
		}	
	});
	
	//减小模糊值
	$("#minus").click(function(){
		var num = parseInt($("#shownum").text());
		var nextnum = num-1;
		if(nextnum>=5 && nextnum<=20)
		{
			$("#shownum").text(nextnum);
			$("#dynamicnum").val(nextnum);
			localStorage["BLURdynamicnum"] = nextnum;
		}
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
						"cmd" : optionmsg
					});
			}
		});
	}
	
});