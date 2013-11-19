// JavaScript Document
var windowLoaded = false;
var comicDataLoaded = false;

window.onload = init;

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
	$.mobile.loading( 'hide');
	showComics2();
}


function showComics2() {
	var cList = "";
	for (var i=0;i<comics.comicsList.length;i++) {
		var c = comics.comicsList[i];
		var panelsLeft = c.panelCount-readPanels(i);
		cList+="<li><a rel='external' href='reader/viewer.html?comic="+i+"'><img src='"+c.folderUrl+c.icon+"'><h2>"+c.title+"<span class='ui-li-count'>"+panelsLeft+"</span></h2><p>"+c.description+"</p></a><a id='info"+i+"' href='#comicinfo' data-rel='popup' data-position-to='window' data-icon='info'>Comic Info</a></li>";
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
	$("#creatorUrl").attr("href", c.creatorUrl)
	$("#creatorUrl").html("By "+c.creatorNames+" (click to view Website)");	
	$("#description").html(c.description);	
	$("#read").attr("href", "reader/viewer.html?comic="+i);
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
