// JavaScript Document
var windowLoaded = false;
var comicDataLoaded = false;
window.onload = init;
var lastSourceForPaywall = "unknown";

// GAME
var blocks = 9;
window.onresize = windowResize;
var spinnerCounter = 0;

// GAME ONLINE DATA
var goldenBlocks = new Array();
for (var q=0; q<15; q++) {
	goldenBlocks[q] = new Array();
}
goldenBlocks[3][1] = true;	
goldenBlocks[4][6] = true;	

function init() {
	if(!window.console){ window.console = {log: function(){} }; } 
	console.log("windowLoaded");
	$.mobile.loading( 'show', {
		text: 'loading',
		textVisible: true,
		theme: 'a',
		html: ""
	});
	windowLoaded = true;
	if (comicDataLoaded) continueInit();
	
};

function continueInit() {
	lastSourceForPaywall = "comic";	
	$.mobile.loading('hide');
	showComics2();
//	comicsListDailyCreditsCheck();
	window.setTimeout(comicsListDailyCreditsCheck, 500);
	window.setTimeout(gaTrack, 1000, ["VIEW"]);
	showCredits();

// GAME	
	drawBlocks();
}

function showComics2() {
	var cList = "";
	for (var i=0;i<comics.comicsList.length;i++) {
		var c = comics.comicsList[i];
		var panelsLeft = c.panelCount-readPanels(i);
		cList+="<li><a rel='external' href='mode.html?comic="+i+"'><img src='"+c.folderUrl+c.icon+"'><h2>"+c.title+"<span class='ui-li-count'>"+panelsLeft+"</span></h2><p>"+c.description+"</p></a><a id='info"+i+"' href='#comicinfo' data-rel='popup' data-position-to='window' data-icon='info'>Comic Info</a></li>";
	//  took the transition out: data-transition='pop'	
	}
	$("#comics2").html(cList);
	$('#comics2').listview('refresh');
	for (var i=0;i<comics.comicsList.length;i++) {
		$("#info"+i).bind('click', { row: i}, function(event) {
			var data = event.data;
			updatePopup(data.row);
		});
	}
}
	
function updatePopup(i) {
	var c = comics.comicsList[i];
	$("#title").html(c.title);
	$("#creatorUrl").attr("href", "mode.html?comic="+i);
	$("#creatorUrl").html("By "+c.creatorNames+" (click to view Website)");	
	$("#description").html(c.description);	
	$("#read").attr("href", "mode.html?comic="+i);
	$('#comicinfo').popup('refresh');		
}

function openComic(index) {
	window.location = "reader/viewer.html?comic="+index;
	}

function openBrowser(url) {
	window.location = url;
	}

function loadScript(){
	if(!window.console){ window.console = {log: function(){} }; } 
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.onload = function(){
		console.log("comicDataLoaded");
		comicDataLoaded = true;
		if (windowLoaded) continueInit();
    };
    script.src = comics.comicsList[0].folderUrl+""+comics.comicsList[0].dataFile+"?"+$.now();
    document.getElementsByTagName("head")[0].appendChild(script);
}

function readPanels(currentComic) {
	if (localStorage.currentPanel2 == undefined) {
		return 0;
	}
	var panelPointer = [];
	console.log(localStorage.currentPanel2);
	panelPointer = JSON.parse(localStorage.currentPanel2);
	if (panelPointer[currentComic] == null) return 0;
	return panelPointer[currentComic];
}

function gaTrack(mode, sum100) {	
	if (mode == "READ") {
		console.log("READ page"+currentPage());
//		$.get( "http://mobcomics.com/zines/analytics/track.html?category=read&action=comic"+currentComic+"&label=page"+currentPage() );
//		$.get( "http://mobcomics.com/zines/analytics/track.html", { category: "John", action: "2pm", label: "test" });			
//		$('#track').attr('src', 'http://mobcomics.com/zines/analytics/track.html?category=read&action=comic'+currentComic+'&label=page'+currentPage());
//		('#track').empty().load('http://mobcomics.com/zines/analytics/track.html?category=read&action=comic'+currentComic+'&label=page'+currentPage());
		$('#track').get(0).contentWindow.location.replace('http://mobcomics.com/zines/analytics/track.html?category=read&action=comic'+currentComic+'&label=page'+currentPage());
		return;
	}
	if (mode == "VIEW") {
		console.log("VIEW");
		$('#track').get(0).contentWindow.location.replace('http://mobcomics.com/zines/analytics/track.html?category=view&action=view&label=comicslist');
		return;
	}	
	if (mode == "PAYWALL") {
		console.log("PAYWALL");
		$('#track').get(0).contentWindow.location.replace('http://mobcomics.com/zines/analytics/track.html?category=credits&action='+lastSourceForPaywall+'&label=paywall'+sum100);
	}	
	if (mode == "USED_ALL_CREDITS") {
		console.log("PAYWALL");
		$('#track').get(0).contentWindow.location.replace('http://mobcomics.com/zines/analytics/track.html?category=credits&action=used&label=all');
	}	
}

function showCredits() {
	$("#creditsLine").html("You have <span style='font-weight:bold;'>"+readCredits()+" panel credits</span> left");	
}

function clickBuy(sum) {
//	addCredits(50);
	console.log("tried to buy $"+sum);
//	showCredits();
	gaTrack("PAYWALL", sum*100);
}

function comicsListDailyCreditsCheck() {
	var dailyCreditsGiven = checkAndAddDailyCredits();
	if (dailyCreditsGiven) {
		$("#dailyCreditsText").html("Each day you use the Sex Comics app, we are happy to give you "+dailyCreditsGiven+" free credits. Have fun reading the comics!");
		$.mobile.changePage( "#dailyCredits", { role: "dialog" } );
		showCredits();
		return;
	} else if (readCredits() <= 0) {
		gaTrack("USED_ALL_CREDITS");
		$.mobile.changePage( "#noCredits", { role: "dialog" } );
	}			   
}

// GAME

function drawBlocks() {
	$(".pinUpImageStyle").css("height", window.innerHeight-200);
	updatePayoutTable();	
	showGameCredits();	
	console.log("drawBlock()");
	blockLoop(true);	
}

function updatePayoutTable() {
	$("#gamePayoutLine").text("Golden Payout: "+goldPayout()+", Black Payout: "+regularPayout());	
}

function blockLoop(first) {
	var imageBlockHeight = backgroundImageHeight()/blocks;
	var imageBlockWidth = backgroundImageWidth()/blocks;
	var top = backgroundImageTop();	
	for (var r=0;r<(blocks);r++) {
		for (var c=0;c<(blocks);c++) {
			if (first) $("<div class='spinnerBlock'></div>").attr('id','block'+r+'_'+c).appendTo('.pinUpImageStyle');	
			$("#block"+r+'_'+c).css("top", top+imageBlockHeight*(r));
			$("#block"+r+'_'+c).css("height", imageBlockHeight);
			$("#block"+r+'_'+c).css("width", imageBlockWidth);	
			$("#block"+r+'_'+c).css("left", widthOffSet()+imageBlockWidth*(c));
			if (goldenBlocks[c][r]) $("#block"+r+'_'+c).css("background-color","#ffd700");
			if (r==0 || c==0 || r==blocks-1 || c==blocks-1) $("#block"+r+'_'+c).css("visibility", "hidden");
		}
	}
}

function backgroundImageHeight() {
//	var bgih = parseInt($(".pinUpImageStyle").css("height"));
	var bgih = parseInt(window.innerHeight)-200;	
//	console.log("bgih: "+bgih);
	return bgih;
}

function backgroundImageWidth() {
//	var bgiw = 743*(parseInt($(".pinUpImageStyle").css("height"))/1000);
	var bgiw = backgroundImageHeight()*(1000/1300);
//	console.log("bgiw: "+bgiw);	
	return bgiw;
}

function backgroundImageTop() {
	return 130;
}

function widthOffSet() {
	var offSet = (parseInt(window.innerWidth)-backgroundImageWidth())/2;
	return  offSet; 
}

function tapToSpin() {
	lastSourceForPaywall = "game";	
	if (readCredits() <= 0) {
		gaTrack("USED_ALL_CREDITS");
		$.mobile.changePage( "#noCredits", { role: "dialog" } );
		showCredits();
		return;
	}
	var r = Math.floor((Math.random()*(blocks)));
	var c = Math.floor((Math.random()*(blocks)));
	useCredits(1);
	if ($("#block"+r+'_'+c).css("visibility") != 'hidden' && goldenBlocks[c][r]) { // gold payout
		addCredits(goldPayout());
	} else if ($("#block"+r+'_'+c).css("visibility") != 'hidden') { // regular payout
		addCredits(regularPayout());		
	}
	$("#block"+r+'_'+c).css("background-color", '#444');
	$("#block"+r+'_'+c).css("visibility", 'visible');
	window.setTimeout(flashBlock, 300, [r, c]);	
	$('#track').get(0).contentWindow.location.replace('http://mobcomics.com/zines/analytics/track.html?category=game&action=spin&label=count'+spinnerCounter++);	
	showGameCredits();
	updatePayoutTable();		
}

function flashBlock(rc) {
	console.log("hide"+rc);
	$("#block"+rc[0]+'_'+rc[1]).css("visibility", 'hidden');	
}

function regularPayout() {
	var allBlocks = (blocks)*(blocks);
	var remainingBlocks = 0;
	for (var r=0;r<(blocks);r++) {
		for (var c=0;c<(blocks);c++) {
			if ($("#block"+r+'_'+c).css("visibility") != 'hidden') remainingBlocks++; 
		}
	}	
	var payout = .8*allBlocks/remainingBlocks;
	if (payout > .5*goldPayout()) payout = .5*payout;
	return parseInt(payout);
}

function goldPayout() {
	
	var borderBlocks = 2*blocks+2*(blocks-2);
	var goldBlocks = 0;
	for (var r=0;r<(blocks-2);r++) {
		for (var c=0;c<(blocks-2);c++) {
			if (goldenBlocks[c][r]) goldBlocks++; 
		}
	}	
	return parseInt(.8*borderBlocks/goldBlocks);
}

function windowResize() { // is called always when orientation is changed, by user 
	$(".pinUpImageStyle").css("background-image", "");
	$(".pinUpImageStyle").css("height", window.innerHeight-200);		
	console.log("resize");
	blockLoop(false);
	$(".pinUpImageStyle").css("background-image", "url('./images/pinup1.png')");
	return false;
}

function showGameCredits() {
	$("#gameCreditsLine").html("<span style='font-weight:bold;'>"+readCredits()+"</span>");		
}


