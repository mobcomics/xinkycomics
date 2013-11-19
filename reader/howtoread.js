// JavaScript Document

window.onload = init;
var panel = myComic.cover;

function init() {
	track('AppID'+myComic.appID+'_session'+sessionStorage.sessionID, "howtoread", "howtoread.js");
	sessionStorage.autoplay=0;
// <NokiaWRT>
	if (window.widget) { 
		if (softkeyControlled) menu.hideSoftkeys(); 
	} 
// </NokiaWRT>
	document.getElementById("bodyId").style.display = 'none';	
    document.getElementById("coverImage").src = panel.pimage;
	window.onresize = windowResize;
	windowResize();
	document.getElementById("bodyId").style.display = 'block';
}

function windowResize() {
	var circleSize;
	if (isPortrait()) circleSize = parseInt(window.innerWidth/2.5); 
	else circleSize = parseInt(window.innerHeight/2.5);
	
	document.getElementById("transparentImageDiv").style.left = "0px";
	document.getElementById("transparentImageDiv").style.top = "0px";
	document.getElementById("transparentImage").width = parseInt(window.innerWidth);
	document.getElementById("transparentImage").height = parseInt(window.innerHeight);

	document.getElementById("nextCircleLink").style.right = parseInt(5)+"px";
	document.getElementById("nextCircleLink").style.top = parseInt(window.innerHeight/2-circleSize*1.2/2)+"px";
	document.getElementById("nextCircleImage").width = parseInt(circleSize*1.2);	

	document.getElementById("previousCircleLink").style.left = parseInt(5)+"px";
	document.getElementById("previousCircleLink").style.top = parseInt(window.innerHeight/2-circleSize*.8/2)+"px";
	document.getElementById("previousCircleImage").width = parseInt(circleSize*.8);	

	document.getElementById("autoplayCircleLink").style.left = parseInt(window.innerWidth/2-circleSize*.8/2)+"px";
	document.getElementById("autoplayCircleLink").style.bottom = parseInt(5)+"px";
	document.getElementById("autoplayCircleImage").width = parseInt(circleSize*.8);	

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
}

function isPortrait() {
	if (window.innerHeight > window.innerWidth) {return true;} else {return false;}
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