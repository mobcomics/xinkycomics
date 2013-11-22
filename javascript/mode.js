$(window).load(function() { init(); });
window.onresize = resizeIframe;
var windowLoaded = false;
var comicDataLoaded = false;
var comicFolder;

function init() {
	if(!window.console){ window.console = {log: function(){} }; } 
	console.log("windowLoaded");
	windowLoaded = true;
	$("#actualFrame").css("height", "1000px");
	resizeIframe();
	$("#actualFrame").css("visibility", "block");
	var c = comics.comicsList[(gup("comic")) ? gup("comic") : 0];
	$("#actualFrame").attr("src", c.creatorUrl);
	$("#pageThumbnail").attr("src", "http://www.smackjeeves.com/images/uploaded/comics/f/e/fef8a053eh0fU.jpg");
	comicFolder = c.folderUrl;
	if (comicDataLoaded) continueInit();
}

function continueInit() {
	alert(myComic.title);
}

function resizeIframe() {
	$("#actualFrame").css("width", $("#body").innerWidth()+"px");	
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

function loadScript(){
	if(!window.console){ window.console = {log: function(){} }; } 
	console.log("comicLoaded");
	var c = comics.comicsList[(gup("comic")) ? gup("comic") : 0];
//	comicFolder = comics.comicsList[gup('comic')].folderUrl;
	comicFolder = c.folderUrl;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.onload = function(){
		comicDataLoaded = true;
		if (windowLoaded) continueInit();
    };
//    script.src = comicFolder+""+comics.comicsList[gup('comic')].dataFile;
  script.src = comicFolder+""+c.dataFile;
    document.getElementsByTagName("head")[0].appendChild(script);
}