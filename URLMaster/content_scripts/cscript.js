//这是content_scripts
/**
只有一个功能，就是获取当前页面的url
 */
//BEGIN
$(function () {
	var currenturl = window.location.href;
	chrome.runtime.sendMessage({
		"url" : currenturl
	});
});