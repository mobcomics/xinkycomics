// JavaScript Document
window.onload = init;
var uagent;
var deviceIphone = "iphone";
var deviceAndroid = "android";
var deviceSymbian = "symbian";
var panel;
var randomString;
var windowLoaded = false;
var comicDataLoaded = false;

function init() {
	console.log("windowLoaded");
	windowLoaded = true;
	if (comicDataLoaded) continueInit();
};

function continueInit() {
	console.log(myComic.cover);
	panel = myComic.cover;
//	alert(myComic.artist.URL);
	uagent = navigator.userAgent.toLowerCase();
	randomString = (Math.floor(Math.random()*10000)).toString()+"_"+platform();
	if (gup('session') != '') randomString = gup('session');
	track('AppID'+myComic.appID+'_session'+randomString, "cover", "cover.js");
//	sessionStorage.sessionID = randomString;
	document.getElementById("artistLink1").href = "artist.html";
	document.getElementById("artistLink2").href = "artist.html";
	document.getElementById("readButton").style.bottom = '30px';
    document.getElementById("coverImage").src = comics.comicsList[0].folderUrl+""+panel.pimage;
//	document.getElementById("header").innerHTML = language.mobile_comics_reader;
	window.onresize = windowResize;
	windowResize();
}

function windowResize () {
	var panelWidth = panel.width;
	var panelHeight = panel.height;
	var heightFactor = 1;
	var widthFactor = 1;
	var factor = 1;
	if (window.innerWidth < panelWidth) widthFactor = window.innerWidth/panelWidth;
	if (window.innerHeight < panelHeight) heightFactor = window.innerHeight/panelHeight;
	if (heightFactor < widthFactor) {factor = heightFactor;} else {factor = widthFactor;}
	document.getElementById("coverImage").height = parseInt(factor*panelHeight);
	document.getElementById("coverImage").width = parseInt(factor*panelWidth);
	document.getElementById("coverImage").style.left = parseInt((window.innerWidth-factor*panelWidth)/2)+'px';	
    document.getElementById("coverImage").style.top = parseInt((window.innerHeight-factor*panelHeight)/2)+'px';
//	var readImageWidth = document.getElementById("readImage").width;
    document.getElementById("readButton").style.bottom = '30px';
    document.getElementById("readButton").style.left = parseInt(window.innerWidth/2-parseInt(document.getElementById("readImage").width)/2)+'px';

	return false;
}
	
function track(key, context, source) {
/*	
    var url = "http://www.mobcomics.com//api/lib/event.php";
    $.post(url,
      {key : key, context : context, src : source},
      function(data) {
      }
    );
*/
}

function gup( name ) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

function platform() {
	if (uagent.search(deviceAndroid) != -1) {
		return deviceAndroid;
	}
	if (uagent.search(deviceSymbian) != -1) {
		return deviceSymbian;
	}
	if (uagent.search(deviceIphone) != -1) {
		return deviceIphone;
	}
	return "unknown";
}

function loadScript(){
    var script = document.createElement("script")
    script.type = "text/javascript";
    script.onload = function(){
		console.log("comicDataLoaded");
		comicDataLoaded = true;
		if (windowLoaded) continueInit();
    };
    script.src = comics.comicsList[0].folderUrl+""+comics.comicsList[0].dataFile;
    document.getElementsByTagName("head")[0].appendChild(script);
}
