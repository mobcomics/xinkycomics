
// JavaScript Document
window.onload = init;

function init() {
//	track('AppID'+myComic.appID+'_session'+sessionStorage.sessionID, "artist", "artist.js");
	document.getElementById("coverLink").href = "cover.html";
	document.getElementById("howtoreadLink").href = "howtoread.html";
//	uagent = navigator.userAgent.toLowerCase();
	document.getElementById("headLine").innerHTML = myComic.title;
//	document.getElementById("header").innerHTML = language.mobile_comics_reader;
	var artists = myComic.artist.URLText;
	var artistTextLink = "";
	
	while (artists.indexOf(',') >= 0) {
		artistTextLink = artistTextLink + "<a href=\"javascript:openBrowser('"+myComic.artist.URL+"')\">"+artists.substring(0,artists.indexOf(','))+"</a>"+"<br />";
		artists = artists.substring(artists.indexOf(',')+1, artists.length);
		}
	artistTextLink = artistTextLink + "<a href=\"javascript:openBrowser('"+myComic.artist.URL+"')\">"+artists+"</a>"+"\n";
	document.getElementById("artistLink").innerHTML = artistTextLink;
	
	var cleantTitleText = new String(myComic.title);
	cleantTitleText = cleantTitleText.split(' ').join('');
	cleantTitleText = cleantTitleText.replace(/[^a-zA-Z 0-9]+/g,'');
	var ids = "?id="+cleantTitleText;
	window.onresize = windowResize;
	windowResize();
};

function openBrowser(urlString) {
//	track('AppID'+myComic.appID+'_session'+sessionStorage.sessionID, urlString, "artist.js");
//	if (uagent.search(deviceAndroid) != -1) {
		window.open(urlString);
//	}
	
/*	else if (uagent.search(deviceSymbian) != -1) {
		urlString = urlString.replace("store.ovi.com", "store.ovi.mobi"); // for Ovi Store only
		widget.openURL(urlString);
	} */	
/*	else { // on PC, so in the tool
		window.location = urlString;
	} */	
}


function windowResize () {
	if (!isPortrait()) {
//		document.getElementById("navigatorButton").className = 'navigatorButtonStyleFixed';
//		document.getElementById("navigatorButton").style.top = (window.innerHeight-document.getElementById("navigatorButton").width)/2 + 'px';	
	} else {
//		document.getElementById("navigatorButton").className = 'navigatorButtonStyle';
//		document.getElementById("spaceBeforeTitle").innerHTML = '<br /><br /><br />';		
	}
	document.getElementById('moreComicsLink').style.left = (window.innerWidth - 300)/2+'px'; 
	return false;
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


