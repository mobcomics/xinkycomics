// JavaScript Document
var windowLoaded = false;
var appDataLoaded = false;

$(window).load(function() { init(); });

function init() {
	console.log("init");
	if(!window.console){ window.console = {log: function(){} }; } 	
	$.mobile.loading( 'show', {
		text: 'loading',
		textVisible: true,
		theme: 'a',
		html: ""
	});
	windowLoaded = true;
	if (appDataLoaded) continueInit(1);
}

function continueInit(i) {
	console.log(i);
	$.mobile.loading('hide');
	window.setTimeout(gaTrack, 500);
	$(".pinUpImageStyle").css("height", window.innerHeight-150);
	drawBlocks();
}

function gaTrack() {
	console.log('timeout');
	$("#track").attr('src', "http://mobcomics.com/zines/analytics/track.html?category=view&action=view&label=game");
}


function loadScript(){
	if(!window.console){ window.console = {log: function(){} }; } 
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.onload = function(){
		console.log("loadScript");
		appDataLoaded = true;
		if (windowLoaded) continueInit(2);
    };
    script.src = "http://mobcomics.com/zines/config/sex/config.js?"+$.now();
    document.getElementsByTagName("head")[0].appendChild(script);
}

function drawBlocks() {
	var blocks = 7;
	console.log(backgroundImageHeight());
	var imageBlockHeight = backgroundImageHeight()/blocks;
	var imageBlockWidth = backgroundImageWidth()/blocks;
	$("#block1").css("top", imageBlockHeight);
	$("#block1").css("height", imageBlockHeight);
	$("#block1").css("left", widthOffSet());
	$("#block1").css("width", imageBlockWidth);
	$("#block2").css("top", 3*imageBlockHeight);
	$("#block2").css("height", imageBlockHeight);
	$("#block2").css("width", imageBlockWidth);	
	$("#block2").css("left", widthOffSet());
}

function backgroundImageHeight() {
	return parseInt($(".pinUpImageStyle").css("height"));
}

function backgroundImageWidth() {
	return 743*(parseInt($(".pinUpImageStyle").css("height"))/1000);
}

function widthOffSet() {
	return  (parseInt($(".pinUpImageStyle").css("width"))-backgroundImageWidth())/2;
}