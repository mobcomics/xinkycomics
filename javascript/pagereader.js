$(window).load(function() { init(); });
var windowLoaded = false;
var comicDataLoaded = false;
var comicFolder;
var panelPointer = [];
var currentComic = "0";

function init() {
	if(!window.console){ window.console = {log: function(){} }; } 
	console.log("windowLoaded");
	if (gup('comic') != "") currentComic = ""+gup('comic')+"";	
	windowLoaded = true;
	if (comicDataLoaded) continueInit();
}

function continueInit() {
	$("#pageDiv").css('text-align', 'center');
	$("#page").attr('src',(browserStoragePanelNumber() <= 0) ? myComic.panels[0].pimage : myComic.panels[browserStoragePanelNumber()-1].pimage);
	$("#navigatorText").html(pageString());
	window.setTimeout(gaTrack, 500, ["VIEW"]);
}

function pageString() {
	return currentPage()+"/"+totalPages();
}

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
	$("#page").attr('src',(p <= 0) ? myComic.panels[0].pimage : myComic.panels[p].pimage);	
	setBrowserStoragePanelNumber(p);
	$("#navigatorText").html(pageString());
}

function nextPageFirstPanel() {
	var previousPage = myComic.panels[(browserStoragePanelNumber() <= 0) ? 0 : browserStoragePanelNumber()-1].pimage;
	var i = (browserStoragePanelNumber() <= 0) ? 0 : browserStoragePanelNumber()-1;
	while (i < myComic.panels.length && previousPage == myComic.panels[i].pimage) {
		i++;
	}
	return (i == myComic.panels.length) ? null : i;		
}

function previousPageFirstPanel() {
	var currentPage = myComic.panels[(browserStoragePanelNumber() <= 0) ? 0 : browserStoragePanelNumber()-1].pimage;
	var i = (browserStoragePanelNumber() <= 0) ? 0 : browserStoragePanelNumber()-1;
	while (i > 0 && currentPage == myComic.panels[i].pimage) {
		i--;
	}
	return i;
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
	var previousPage = "empty";
	var count = 0;
	var page = 0;
	for (var i=0;i<myComic.panels.length;i++) {
		if (previousPage != myComic.panels[i].pimage) count++;
		if (browserStoragePanelNumber() == i) page = count;
		previousPage = myComic.panels[i].pimage;
	}
	console.log("page "+page);
	return page;		
}

function setBrowserStoragePanelNumber(p) {
	if (localStorage.currentPanel2 != undefined) panelPointer = JSON.parse(localStorage.currentPanel2);	
	if (p < myComic.panels.length && p != null) {
		panelPointer[currentComic] = p+1;
	} else {
		console.log("no change for local storage");
		return;
	}
	localStorage.currentPanel2 = JSON.stringify(panelPointer);
	console.log(localStorage.currentPanel2);
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
	console.log(localStorage.currentPanel2);
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



