// JavaScript Document
var windowLoaded = false;
var appDataLoaded = false;
var blocks = 6;

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
	console.log(backgroundImageHeight());
	var imageBlockHeight = backgroundImageHeight()/blocks;
	var imageBlockWidth = backgroundImageWidth()/blocks;
	var top = parseInt($(".pinUpImageStyle").position().top);
	console.log(top);
	for (var r=0;r<(blocks-2);r++) {
		for (var c=0;c<(blocks-2);c++) {
			$("<div class='spinnerBlock'></div>").attr('id','block'+r+'_'+c).appendTo('.pinUpImageStyle');	
			$("#block"+r+'_'+c).css("top", top+imageBlockHeight*(r+1));
			$("#block"+r+'_'+c).css("height", imageBlockHeight);
			$("#block"+r+'_'+c).css("width", imageBlockWidth);	
			$("#block"+r+'_'+c).css("left", widthOffSet()+imageBlockWidth*(c+1));		
		}
	}
}

function backgroundImageHeight() {
	return parseInt($(".pinUpImageStyle").css("height"));
}

function backgroundImageWidth() {
	return 743*(parseInt($(".pinUpImageStyle").css("height"))/1000);
}

function widthOffSet() {
	return  1.12*(parseInt($(".pinUpImageStyle").css("width"))-backgroundImageWidth())/2; // FIX THIS: counts wrong
}

function removeRandomBlock() {
	var r = Math.floor((Math.random()*(blocks-2)));
	var c = Math.floor((Math.random()*(blocks-2)));
	$("#block"+r+'_'+c).css("background-color", '#444');
	$("#block"+r+'_'+c).css("visibility", 'visible');
	window.setTimeout(flashBlock, 300, [r, c]);	
}

function flashBlock(rc) {
	console.log("hide"+rc);
	$("#block"+rc[0]+'_'+rc[1]).css("visibility", 'hidden');	
}
