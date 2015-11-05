function selectionOnClick(info, tab) {
	var method = {
		keyword : info.selectionText,
		dataType : "json"
	};
	var rawurl = "";
	$.get('http://www.blogso.cn/urlmaster/index.php/Index/decodeURL/index.html', method, function (response) {
		rawurl = response.rawurl;

		window.open(rawurl);
	});

	//console.log(rawurl);

}
function funcChina(fanyistring) {
	var obj = fanyistring;
	if (/.*[\u4e00-\u9fa5]+.*$/.test(obj)) {
		//alert("不能含有汉字！");
		return false;
	}
	return true;
}
var selection = chrome.contextMenus.create({
		"title" : "转跳到网页",
		"contexts" : ["selection"],
		"onclick" : selectionOnClick
	});

//接收来自插件的消息
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
	if (request.url != undefined) {
		localStorage["currenturl"] = request.url;
	}
});
