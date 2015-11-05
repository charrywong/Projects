//这是选项页面的js
	$(function () {
		$fillurl = localStorage["currenturl"] || "";
		$("#url").val($fillurl);
		//把链接转换成字符串
		$("#encode").click(function () {
 			if(isURL($("#url").val())==false)
			{
				$("#keyword").val("请检查URL格式");
				return;
			}
			var method = {
				rawurl : $("#url").val(),
				dataType : "json"
			};
			$.get('http://www.blogso.cn/urlmaster/index.php/Index/encodeURL/index.html', method, function (response) {
				$("#keyword").val(response.keyword);
			});
		});
		
		//把字符串转换成连接
		$("#decode").click(function () {
			var method = {
				keyword : $("#keyword").val(),
				dataType : "json"
			};
			$.get('http://www.blogso.cn/urlmaster/index.php/Index/decodeURL/index.html', method, function (response) {
				$("#url").val(response.rawurl);
			});
		});
		
		//查看使用说明
		$("#instruction").click(function(){
			$("#instructfield").toggleClass('instructhide');
		});
		
		//检测URL的合法性
		function isURL(str) {// 验证url
			var RegUrl = new RegExp();
			RegUrl.compile("^((https|http|ftp|rtsp|mms)?://)[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
			if (!RegUrl.test(str)) {
				return false;
			}
			return true;
		}

		//接收来自插件的消息
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			if (request.url != undefined) {
				localStorage["currenturl"] = request.url;
			}
		});
		
	});