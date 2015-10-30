function selectionOnClick(info, tab) { 
if(funcChina(info.selectionText))
	{
		//不含有汉字
		window.open('http://translate.google.cn/#en/zh-CN/'+info.selectionText);
	}
	else
	{
		//含有汉字
		window.open('http://translate.google.cn/#zh-CN/en/'+info.selectionText);
	}
} 
function funcChina(fanyistring){   
	var obj =  fanyistring;
	if(/.*[\u4e00-\u9fa5]+.*$/.test(obj)) {   
    //alert("不能含有汉字！");   
    return false;   
   }   
    return true;   
}  
var selection = chrome.contextMenus.create({"title": "谷歌翻译","contexts":["selection"],"onclick":selectionOnClick}); 