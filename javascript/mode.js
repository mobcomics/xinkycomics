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
	comicFolder = c.folderUrl;
	if (comicDataLoaded) continueInit();
}

function continueInit() {
	var p = myComic.panels[0];
	$("#pageThumbnail").attr("src", p.pimage);
	var i = new Image();
	i.src = p.pimage;
	i.onload = function(){    
	    imageLoaded(i, p);
	};
}

function imageLoaded(i, p) {
	var x = i.width/1000;
	var scale = 130/(p.subImage.height);
	$("#panelThumbnail").css({
		zoom: scale,
		width: x*p.subImage.width,
		height: x*p.subImage.height,
		background: "url('" + p.pimage + "')",
		backgroundPosition: -x*p.subImage.x+"px " + -x*p.subImage.y + "px"
	});	
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