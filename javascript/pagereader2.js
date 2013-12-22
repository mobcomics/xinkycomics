$(window).load(function() { init(); });
var windowLoaded = false;
var comicDataLoaded = false;
var comicFolder;
var panelPointer = [];
var currentComic = "0";
var pageCounter = 0;
var oldestPageRead =  0;
var newestPageRead = 0;
var oldestPageDownloaded = 0;
var newestPageDownloaded = 0;
var loadingPage = false;
var loadingOlderPage = false;
var lastPageRead = false;
var scrollSet = false;

function init() {
	if(!window.console){ window.console = {log: function(){} }; } 
	console.log("windowLoaded");
	if (gup('comic') != "") currentComic = ""+gup('comic')+"";	
	windowLoaded = true;
	if (comicDataLoaded) continueInit();
}

function continueInit() {
	newestPageRead = currentPage();
	oldestPageRead = currentPage();
	newestPageDownloaded = currentPage();
	oldestPageDownloaded = currentPage();
	$("#pages").append("<div id='pageDiv"+newestPageRead+"' class='pageDivStyle'><img class='pageDivStyle' id='page"+newestPageRead+"' src=''></img></div>");
	$("#pageDiv"+newestPageRead).css('text-align', 'center');
	$("#page"+newestPageRead).attr('src',(browserStoragePanelNumber() <= 0) ? myComic.panels[0].pimage : myComic.panels[browserStoragePanelNumber()-1].pimage);
	$("#navigatorText").html(pageString());
	window.setTimeout(gaTrack, 500, ["VIEW"]);
	appendNewPage();
	window.setTimeout(setScroll, 50);
	$(window).scroll(function() { checkScroll(); });	
}

function setScroll() {
	window.scrollTo(0,50);	
	scrollSet = true;
}

function checkIfAppendNewPage() {
	if ($("#pageDiv"+newestPageDownloaded).position().top < window.innerHeight) {
		appendNewPage();
	}
}

function prependPreviousPage() {
	if (loadingOlderPage) return;
	if (oldestPageDownloaded <= 1) return; // back on the first page
	console.log("opd"+oldestPageDownloaded);
	console.log("npd"+newestPageDownloaded);
	console.log("opr"+oldestPageRead);
	console.log("npr"+newestPageRead);
	loadingOlderPage = true;
	page = --oldestPageDownloaded;	
	$("#pages").prepend("<div id='pageDiv"+page+"' class='pageDivStyle'><img class='pageDivStyle' id='page"+page+"' src=''></img></div>");
	$("#page"+page).bind('load', { t: page}, function(event) {
		setScroll();
		window.setTimeout(allowLoadingOlderPage, 300);
	});	
	$("#page"+page).attr('src', imageOfPage(page));		
}

function allowLoadingOlderPage() {
	loadingOlderPage = false;
}

function appendNewPage() {
	if (loadingPage) return;
	if (newestPageDownloaded >= totalPages()) {
		if (!$("#noMorePages").length != 0) {
			$("#pages").append("<div id='noMorePages' class='pageDivStyle'>Hey, you have read all we got for now! Updates are coming weekly...</div>");			
		}
		return; // all pages already loaded
	}
	if (readCredits() <= 0) {
		$("#noMoreCredits").addClass("websiteWarningDiv");
		$("#noMoreCredits").css("visibility", "visible");			
		return; // all pages already loaded		
	}
	loadingPage = true;
	page = ++newestPageDownloaded;
//	var pp = nextPageFirstPanel();
	var pp = firstPanelOnPage(page);
	$("#pages").append("<div id='pageDiv"+page+"' class='pageDivStyle'><img class='pageDivStyle' id='page"+page+"' src=''></img></div>");
	$("#page"+page).bind('load', { t: page}, function(event) {
//		var p = nextPageFirstPanel();
		var data = event.data;
		var p = firstPanelOnPage(data.t);
		if (parseInt($("#pageDiv"+data.t).position().top)+parseInt($("#pageDiv"+data.t).height()) > window.innerHeight) {
			$("#pageDiv"+data.t).css("opacity",.05);
			// $("#pageDiv"+data.t).width(window.innerWidth/2);
		} else { // reading new page
			useCredits(panelsOnPage(data.t));
			setBrowserStoragePanelNumber(firstPanelOnPage(p));
			window.setTimeout(gaTrack, 2000, ["VIEW"]);
			$("#navigatorText").html(pageString());
		}
			
		loadingPage = false;
		checkIfAppendNewPage();
	});	
	$("#page"+page).attr('src',(pp <= 0) ? myComic.panels[0].pimage : myComic.panels[pp-1].pimage);	
}

function checkScroll() {
//	console.log($(window).scrollTop());
	for (var i=oldestPageRead; i <= newestPageDownloaded; i++) {
		if (parseInt($(window).scrollTop())+window.innerHeight-100 > parseInt($("#pageDiv"+i).position().top)) {
			if ($("#pageDiv"+i).css("opacity") != 1) { // reading new page
				useCredits(panelsOnPage(i)); 
				setBrowserStoragePanelNumber(firstPanelOnPage(i));	
				window.setTimeout(gaTrack, 2000, ["VIEW"]);
				$("#navigatorText").html(pageString());
			}
			$("#pageDiv"+i).css("opacity", 1);
			if (i > newestPageRead) newestPageRead = i;
		}
	}	
//	if ($(window).scrollTop() <= 10) console.log("top");
	if (!loadingPage && parseInt($(window).scrollTop()) < 40) {
		prependPreviousPage();
	}
	if (lastPageRead) return;
	if (!loadingPage && parseInt($(window).scrollTop())+window.innerHeight+100 > parseInt($("#pageDiv"+newestPageDownloaded).position().top)) {
		appendNewPage();
		if (newestPageRead == totalPages()) lastPageRead = true;
	}
}

/*
function pageClicked() {
	gaTrack("READ");
	var selection = "";
	if (event) {
	 var clickXCoord = event.x;
	 if (clickXCoord < window.innerWidth/3) selection = "LEFT";
	else selection = "RIGHT";
	if (selection == "LEFT") {
		if (previousPageFirstPanel() <= 0) window.location = "comicslist3.html";
		showPageOfPanel(previousPageFirstPanel());
		return false;
	  }
	  if (selection == "RIGHT") {
		if (nextPageFirstPanel() == null) window.location = "comicslist3.html";
		else {
			console.log("nextPageFirstPanel() :"+nextPageFirstPanel());
			console.log("browserStoragePanelNumber() :"+browserStoragePanelNumber());
			if (useCredits(nextPageFirstPanel()-browserStoragePanelNumber()) <= 0) {
				window.location = "comicslist3.html";
			}
			showPageOfPanel(nextPageFirstPanel());		
		}
	  }
	}
	return false;
}

function showPageOfPanel(p) {
	$("#page"+oldestPageRead).attr('src',(p <= 0) ? myComic.panels[0].pimage : myComic.panels[p].pimage);	
	setBrowserStoragePanelNumber(p);
	$("#navigatorText").html(pageString());
}
*/
/*
function nextPageFirstPanel() {
	var currentPageImage = myComic.panels[(browserStoragePanelNumber() <= 0) ? 0 : browserStoragePanelNumber()-1].pimage;
	var i = (browserStoragePanelNumber() <= 0) ? 1 : browserStoragePanelNumber()+1;
	while (i <= myComic.panels.length && currentPageImage == myComic.panels[i-1].pimage) {
		i++;
	}
	return (i > myComic.panels.length) ? null : i;		
}
*/
/*
function previousPageFirstPanel() {
	var change = 0;
	var panel = browserStoragePanelNumber();
	var currentPageImage = myComic.panels[(panel <= 0) ? 1 : panel-1].pimage;
//	console.log(currentPageImage);
	var i = (panel <= 0) ? 1 : panel-1;
	while ((i > 0 && currentPageImage == myComic.panels[i-1].pimage) || (i > 0 && change < 1)) {
		if (currentPageImage != myComic.panels[i-1].pimage) {
			change++;
			currentPageImage = myComic.panels[i-1].pimage;
		}
		i--;
	}
	return i+1;	
}
*/

function pageString() {
	return currentPage()+"/"+totalPages();
}

function totalPages() {
	var previousPage = "empty";
	var count = 0;
	for (var i=0;i<myComic.panels.length;i++) {
		if (previousPage != myComic.panels[i].pimage) count++;
		previousPage = myComic.panels[i].pimage;
	}
	return count;
}

function currentPage() {
	var previousPageImage = myComic.panels[0].pimage;
	var count = 1;
	var page = 1;
	for (var i=2;i<=myComic.panels.length;i++) {
		if (previousPageImage != myComic.panels[i-1].pimage) count++;
		if (browserStoragePanelNumber() == i) page = count;
		previousPageImage = myComic.panels[i-1].pimage;
	}
	return page;		
}

function imageOfPage(p) {
	var found = false;
	var image = null;
	var previousPageImage = myComic.panels[0].pimage;
	var cc = 1;
	for (var i = 1; i <= myComic.panels.length; i++) {
		if (p == cc && !found) {
			image = myComic.panels[i-1].pimage;
			found = true;
		}
		if ((previousPageImage != myComic.panels[i-1].pimage)) {
			cc++;
			previousPageImage = myComic.panels[i-1].pimage;
		}
	}
	return image;			
}

function panelsOnPage(p) {
	var pc = 1;	
	var panC = 0;
	var previousPageImage = myComic.panels[0].pimage;
	for (var i = 2; i <= myComic.panels.length; i++) {
		if (p == pc) {
			panC++;			
		}		
		if ((previousPageImage != myComic.panels[i-1].pimage)) {
			pc++;
			previousPageImage = myComic.panels[i-1].pimage;
		}
	}
	if (p == totalPages()) panC++;
	return panC;
}

function firstPanelOnPage(p) {
	var pc = 1;	
	var tp = 0;
	var found = false;
	var previousPageImage = myComic.panels[0].pimage;
	for (var i = 2; i <= myComic.panels.length; i++) {
		if (p == pc && !found) {
			tp = i;			
			found = true;
		}		
		if ((previousPageImage != myComic.panels[i-1].pimage)) {
			pc++;
			previousPageImage = myComic.panels[i-1].pimage;
		}
	}
	tp--;
	return (tp > 0) ? tp : null;
}

function setBrowserStoragePanelNumber(p) {
	if (localStorage.currentPanel2 != undefined) panelPointer = JSON.parse(localStorage.currentPanel2);	
	if (p < myComic.panels.length && p != null) {
		panelPointer[currentComic] = p;
	} else {
		console.log("no change for local storage");
		return;
	}
	localStorage.currentPanel2 = JSON.stringify(panelPointer);
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
	currentComic = ""+(gup("comic") ? gup("comic") : 0) +"";
	console.log("current comic "+currentComic);
	comicFolder = c.folderUrl;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.onload = function(){
		comicDataLoaded = true;
		if (windowLoaded) continueInit();
    };
    script.src = comicFolder+""+c.dataFile+"?"+$.now();
    document.getElementsByTagName("head")[0].appendChild(script);
}

function browserStoragePanelNumber() {
	if (localStorage.currentPanel2 == undefined) {
		return 1;
	}
//	console.log(localStorage.currentPanel2);
	panelPointer = JSON.parse(localStorage.currentPanel2);
	if (panelPointer[currentComic] == null) return 1;
	return panelPointer[currentComic];
}

function gaTrack(mode) {	
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
		$('#track').get(0).contentWindow.location.replace('http://mobcomics.com/zines/analytics/track.html?category=view&action=view&label=pagereader');
		return;
	}	
}



