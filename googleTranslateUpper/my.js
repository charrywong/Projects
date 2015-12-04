//this is my JavaScript.

//BEGIN

$(document).ready(function () {
$('body').mouseup(function (e) {
	$("#googlefanyitip").remove(); //remove old translation
	var pointX = e.pageX;
	var pointY = e.pageY; //loaction mouse
    var pos = String(window.getSelection());; //if selected nothing,end script
	if(!pos)return;
	$('body').append('<div id="googlefanyitip"></div>'); //add translate DIV
	
	//add STYLE for DIV
	$("#googlefanyitip").addClass("googlefanyitipcon").css({
		left:pointX+10,
		top:pointY+10,
		"min-width":"250px",
		"max-width":"400px",
		"z-index":"220",
		display:"none"
	}).append('<div id="googlefanyicontent" class="translateContent"></div>'); //add translate content DIV
	$("#googlefanyicontent").append('<p id="googlefanyiptag" style="margin:0 8px">test</p>'); //add tag P
	
	//zh-CN to EN parameters
	var methodz_e = {
		client:"webapp",
		sl:"zh-CN",
		tl:"en",
		hl:"zh-CN",
		source:"bh",
		ssel:"0",
		tsel:"0",
		kc:"1",
		tk:"666115.790020",
		q:pos
	};
	
	//EN to zh-CN parameters
	var methode_z = {
		client:"webapp",
		sl:"en",
		tl:"zh-CN",
		hl:"zh-CN",
		source:"bh",
		ssel:"0",
		tsel:"0",
		kc:"1",
		tk:"666115.790020",
		q:pos
	};
	var obj = new Object();
	
	//Ajax request to translate.google.cn
	$.get('http://translate.google.cn/translate_a/single?dt=bd&dt=rm&dt=t',isEnglish(pos)==true?methode_z:methodz_e, function (response) {
		console.log(response); //print rew XMLReponse
		var txt = response; //Pure text response from google web site
		var reg1 = /,(?=(,|\]))/g; 
		var reg2 = /\[,/g;
		var reg3 = /\\n/g;
		txt = txt.replace(reg1,",\"\"");  //regx: , to ,""
		txt = txt.replace(reg2,"[\"\","); //regx: [, to ["",
		txt = txt.replace(reg3,"<br />"); //regx: [, to ["",
		console.log(txt); //print replaced Json string
		obj = $.parseJSON(txt); //Json to Object
		console.log(obj); //print raw Json Object
		console.log(creatTransObj(obj)); //print transfromed Json Object
		console.log(makeTip(creatTransObj(obj))); //print translate <p> tag's text
		if(creatTransObj(obj).translation!="")
		{
			$("#googlefanyitip").show();
			$("#googlefanyiptag").html(makeTip(creatTransObj(obj)));
		}
	},"text");

	/*
	 * Description: charge a string is english or not
	 * Parameters: String 
	 * Return: Boolean
	*/
	function isEnglish(fanyistring){   
		var obj =  fanyistring;
		if(/.*[\u4e00-\u9fa5]+.*$/.test(obj)) {   
		//alert("待翻译内容含有汉字！");   
		return false;   
	   }   
		return true;   
	}  
	
	/*
	 * Description: Create transfromed Json Object,it's translate result
	 * Parameters: Array 
	 * Return: Object
	*/
	function creatTransObj(transArray){
	    var getsound = function(arr){
			return arr[arr.length-1];
		};
		var getmeaning = function(arr){
			var meaning = new Object();
			meaning.translation = "";
			meaning.raw = "";
			$.each(arr,function(n,subarr){
				if(n<arr.length-1)
				{
					meaning.translation += subarr[0].replace(/\/n/g,"<br/>");
			        meaning.raw += subarr[1].replace(/\/n/g,"<br/>");
				}
			});
			return meaning;
		};
		var transResult = {
			head:{
				meaning:{
					translation:getmeaning(transArray[0]).translation||"",
					raw:getmeaning(transArray[0]).raw||""
				},
				sound:{
					pinyin:"",
					phonetic:""
				}
			},
			body:{
				
			},
			languageTag:transArray[2]||"",
			warning:"",
			wordsTag:true
		}
		if(!$.isArray(transArray)) {transResult.warning+="NOT_AN_ARRAY&"; return transResult;}; 
		var transList = new Array();
		transResult.wordsTag=transArray[1].length>0?true:false;
		if(transArray[2]=="en"){
			transResult.head.sound.pinyin = getsound(transArray[0])[2]||"";
			transResult.head.sound.phonetic = getsound(transArray[0])[3]||"";
		}else if(transArray[2]=="zh-CN"){
			transResult.head.sound.pinyin = getsound(transArray[0])[3]||"";
			transResult.head.sound.phonetic = "";
		}else{
			transResult.warning+="LANGUAGE_NOT_FOUND&";
		}
		
		transList = $.map(transArray[1],function(wordArray,n){
			var cixing = "[<span class='googlefanyicixing'>"+wordArray[0]+"</span> ]:"||"";
			var meaning = spacerArray(wordArray[1],", ");
			var newString = cixing+"&nbsp;&nbsp;<span class='googlefanyimeaning'>"+meaning+"</span>";
			return newString;
		});
		transResult.body = transList;
		
		return transResult;
	}
	
	/*
	 * Description: Create text for innerHTML p tag, use the transfromed Json Object
	 * Parameters: Object 
	 * Return: Text(String)
	*/
	function makeTip(transResult){
		var transTipObj = new Object();
		if(transResult.languageTag=="en"){
			var translation = transResult.head.meaning.translation;
			if(transResult.wordsTag==true){
				var sound =""+ transResult.head.sound.phonetic;
				if(sound!="")
				{
					transTipObj.firstline = translation+"<span class='googlefanyisound'>["+sound+"]</span>";
				}
				else
				{
					transTipObj.firstline = translation;
				}
			}
			else{
				transTipObj.firstline = translation;
			}
		}
		if(transResult.languageTag=="zh-CN"){
			var translation = transResult.head.meaning.translation;
			if(transResult.wordsTag==true){
				var sound =""+ transResult.head.sound.pinyin;
				if(sound!="")
				{
					transTipObj.firstline = transResult.head.meaning.raw+"<span class='googlefanyisound'>["+sound+"]</span>"+" "+translation;
				}
				else
				{
					transTipObj.firstline = transResult.head.meaning.raw+" "+translation;
				}
			}
			else{
				transTipObj.firstline = translation;
			}
			
		}
		transTipObj.listText = spacerArray(transResult.body,"<br />");
		return spacerArray(transTipObj,"<br />");
	}
	
	/*
	 * Description: Add spacer for Array or Object,and create a new string
	 * Parameters: Object or Array 
	 * Return: Text(String)
	*/
	function spacerArray(arr,str){
		var newstr="";
		var count = 0;
		var lengthArr = function(testarr){
			var i = 0;
			$.each(arr,function(){
				i++;
			});
			return i;
		};
		$.each(arr,function(n,value){
			count++;
			if(count<lengthArr(arr))
			{
				newstr+=value+str;
			}else{
				newstr+=value;
			}
		});
		return newstr;
	}
	
});
});