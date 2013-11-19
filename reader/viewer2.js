// JavaScript Document

window.onload = init;

// TODO: to be changed by Creator 
var inAppAdsEnabled = true;
var showAtLeastPanels = 6;

// Settings mainly for Symbian devices. Not modified.
var orientationControlled = false;
var softkeyControlled = true;

var thisPic = 0;
var thisOrientation = "PORTRAIT"; // just default. Set in comic JSON file.
// var navigatorButtonStyle = "'navigatorButtonStyle'"; // sets the control button CCS style to portrait
var panelLoaded = false;
window.onresize = windowResize;
// var counter = 0;
var swipeCounter = 0;
var savedThisPic = 0;
var savedImageSrc = "";
var panelTop = 0;
var panelLeft = 0;
var factor = 1;
var panelWidth = 0;
var panelHeight = 0;
var zoomingOn = false;
var transitionSteps = 20; // how many steps in transition 
var transitionStepDelay = 25; // transition step in msec 
var pageTransitionSteps = 5; // how many steps in transition 
var pageTransitionStepDelay = 40;
var pageTransitionOn = false;
var panelTransitionOn = false;
var newPageDelay = 300; // delay before showing image from new page, after closePage transition
var autoPlayDelay = 4000;
var autoPlay = false;
// var skipAutoPlayEvent = false;
var skipPanelTransitionEvent = false;
var transitionEventCounter = 0;
var	uagent;
var panelTransitionTable = new Array(20);
var fadeImages = new Array(pageTransitionSteps);
var fadeImageFile = 'tranparent10.png'; // 10% transparency
var showInAppAd = false;
var windowLoaded = false;
var comicDataLoaded = false;
var comicFolder;
var panelPointer = [];
var currentComic = "0";

function init() {
	if(!window.console){ window.console = {log: function(){} }; } 
	console.log("windowLoaded");
	comicFolder = comics.comicsList[gup('comic')].folderUrl;
	windowLoaded = true;
	if (comicDataLoaded) continueInit();
};

function continueInit() {
//	track('AppID'+myComic.appID+'_session'+sessionStorage.sessionID, "viewer", "viewer.js");
	if (gup('comic') != "") currentComic = ""+gup('comic')+"";
	console.log(currentComic);
	uagent = navigator.userAgent.toLowerCase();
/*	if (uagent.search("symbian") > -1) { // Symbian device performance are typically low
		transitionSteps = parseInt(transitionSteps/2);  
		transitionStepDelay = parseInt(transitionStepDelay*2); 
		pageTransitionSteps = 1;  
		pageTransitionStepDelay = parseInt(pageTransitionStepDelay*2); 
		fadeImageFile = 'tranparent.png'; // 50% transparency
		}
*/	for (var i=0; i <= transitionSteps; i++) { // create the table
			panelTransitionTable[i] = {'factor': 1, 'panelLeft': 0, 'panelTop': 0, 'panelWidth': 100,'panelHeight': 100, 'widthPrct': '100%'};
	}
	for (var j=0; j <= pageTransitionSteps; j++) { // set up fade in/out images table
		fadeImages[j] = document.createElement("img");
		fadeImages[j].src = fadeImageFile;
		fadeImages[j].style.zIndex = 2;
		fadeImages[j].style.top = '0px';		
		fadeImages[j].style.left = '0px';		
		fadeImages[j].style.position = 'fixed';
		fadeImages[j].style.display = 'block';
		document.body.appendChild(fadeImages[j]);
	}
	reDrawLayout();
	preparePanel();
	var circleSize;
	if (isPortrait()) circleSize = parseInt(window.innerWidth/2.5); 
	else circleSize = parseInt(window.innerHeight/2.5);
	document.getElementById("nextLinkImage").style.right = parseInt(5)+"px";
	document.getElementById("nextLinkImage").style.top = parseInt(window.innerHeight/2-circleSize*1.2/2)+"px";
	document.getElementById("nextLinkImage").width = parseInt(circleSize*1.2);
	setTimeout(hideTapGuide, 2000);	
	document.getElementById("pictureFrameLink").onclick = processKeypress;
	document.getElementById("playIndicator").style.display = 'none'; 
//	if (window.widget) {if (softkeyControlled) menu.hideSoftkeys();}
	if (gup('panel') != "") {processShortcut(parseInt(gup('panel')))} // Creator uses url parameter for deeplinking to a panel
	else if (browserStoragePanelNumber() > 0) {  
		processShortcut(parseInt(browserStoragePanelNumber()));
	};
	if (browserStorageAutoplay()) {
		autoPlay = true;
		document.getElementById("playIndicator").style.display = 'block'; // makes image visible
		setTimeout(callAutoPlay, autoPlayDelay);
	}
//	jQuery( window ).on( "swipe", function( event ) {
//		console.log("swipe");									   
//		if (autoPlay) transitionEventCounter++;
//		processNext();								   				   
//	});
}

function processShortcut(panelNumber) {
	inAppAdsEnabled = false; // if shortcut is used to start reading the in-app ads are off
	hideTapGuide(); // if shortcut is used, hide the tapping guide right away
	thisPic = panelNumber-1;
	setBrowserStoragePanelNumber();
//	sessionStorage.currentPanel = thisPic+1;
	if (thisPic <= -1 || thisPic >= myComic.panels.length) {
//		sessionStorage.currentPanel = 0;
		resetBrowserStoragePanelNumber();
		window.location = "../comicslist3.html"; 
		return false; 
	} 
	document.getElementById("myPicture").style.display = 'block';
	setTimeout(preparePanel, 1);
	return false;
}

function processPrevious() {
	thisPic--;
//	sessionStorage.currentPanel = thisPic;
	setBrowserStoragePanelNumber();
	if (thisPic == -1) {
		window.location = "../comicslist3.html"; 
		return false; 
	} 
	document.getElementById("myPicture").style.display = 'none';
	setTimeout(preparePanel, 1);
	return false;
}

function callAutoPlay() {
//	alert(transitionEventCounter);
	if (!autoPlay) {
		transitionEventCounter--;
		return false; // if autoPlay has been switched off during timeout
	}
	if (transitionEventCounter > 0) {
		transitionEventCounter--;
		return false;
	}
	processNext();
	return true;
}

function processKeypress() {
	var selection = "";
	if (event) {
	 var clickXCoord = event.x;
	 var clickYCoord = event.y;	 
	 if (clickXCoord < window.innerWidth/5) selection = "LEFT";
	 else if ((clickXCoord < 2*window.innerWidth/3) && (clickYCoord > 5*window.innerHeight/6)) selection = "CENTER";
//	 if (clickXCoord >= 2*window.innerWidth/3) selection = "RIGHT";
	else selection = "RIGHT";
	if (selection == "CENTER") {
		if (autoPlay) {
			transitionEventCounter++; // to skip the remaining event
			autoPlay = false;
			setBrowserStorageAutoplay(false);
	//		skipAutoPlayEvent = false;
			document.getElementById("playIndicator").style.display = 'none'; // hide image 
			return false;
		} else {
			document.getElementById("playIndicator").style.display = 'block'; // makes image visible
			autoPlay = true;
			setBrowserStorageAutoplay(true);
		}
	  }
	  if (selection == "LEFT") {
		  if (autoPlay)	transitionEventCounter++; // to skip the remaining event
		  autoPlay = false;
		  document.getElementById("playIndicator").style.display = 'none'; // hide image 
		  processPrevious();
		  return false;
	  }
	  if (selection == "RIGHT") {
		  if (autoPlay) { 
			  	transitionEventCounter++;
		  }		
	   }
	}
	processNext();
	return false;
}

function processNext() {
//	track('AppID'+myComic.appID+'_session'+sessionStorage.sessionID, thisPic.toString(), "viewer.js");
	thisPic++;	
	setBrowserStoragePanelNumber(); 
	for (var j=0; j <= pageTransitionSteps; j++) { // hide fade out images
		fadeImages[j].style.display = 'none';
	}
	if (inAppAdsEnabled && thisPic == showAtLeastPanels) showInAppAd = true;  
	if (thisPic == myComic.panels.length) { 
		window.location = "../comicslist3.html"; 
		return false;
	}
	if ((myComic.panels[thisPic].pimage == savedImageSrc) || pageTransitionOn) { // if pagetranstition is on do not start a new one
		pageTransitionOn = false; 
		preparePanelTransition(); 
	} else { // check if image file changes
		pageTransitionOn = true;
		closePage(pageTransitionSteps);
	}
	if (autoPlay) { 
		setTimeout(callAutoPlay, autoPlayDelay);
	} 
	return false;
}

function panelTransition(counter) {
	if (counter > transitionSteps) {
		return false;
	}
	factor = panelTransitionTable[counter].factor;
	panelLeft = panelTransitionTable[counter].panelLeft;
	panelTop = panelTransitionTable[counter].panelTop;
	panelWidth = panelTransitionTable[counter].panelWidth;
	panelHeight = panelTransitionTable[counter].panelHeight;
	var cts = counter/transitionSteps;
	document.getElementById("myPicture").style.width = panelTransitionTable[counter].widthPrct;
	document.getElementById("myPicture").style.left = (parseInt(panelLeft)-factor*(myComic.panels[thisPic-1].subImage.x+(cts)*(myComic.panels[thisPic].subImage.x-myComic.panels[thisPic-1].subImage.x)))+'px';
	document.getElementById("myPicture").style.top = (parseInt(panelTop)-factor*(myComic.panels[thisPic-1].subImage.y+(cts)*(myComic.panels[thisPic].subImage.y-myComic.panels[thisPic-1].subImage.y)))+'px';
	drawPictureFrame();
	displayPanel();
	setTimeout(function() {panelTransition(counter+1)},transitionStepDelay);
}

function preparePanelTransition() {	
	// variables with postfix 1 is the current image, 2 is the next
	savedImageSrc = myComic.panels[thisPic].pimage; // save the name if the image file
	document.getElementById("myPicture").src = comicFolder+""+myComic.panels[thisPic].pimage; 
	var heightFactor = 1;
	var widthFactor = 1;
	var factor1 = factor;
	var factor2 = 1;
	var panelWidth1 = panelWidth;
	var panelHeight1 = panelHeight;
	var panelWidth2;
	var panelHeight2;	
	panelWidth2 = myComic.panels[thisPic].subImage.width;
	panelHeight2 = myComic.panels[thisPic].subImage.height;		
	if (window.innerWidth < panelWidth2) widthFactor = window.innerWidth/panelWidth2;
	if (window.innerHeight < panelHeight2) heightFactor = window.innerHeight/panelHeight2;
	if (heightFactor < widthFactor) {factor2 = heightFactor;} else {factor2 = widthFactor;}
	var panelLeft1 = panelLeft;
	var panelTop1 = panelTop;
	var panelLeft2 = parseInt((window.innerWidth-factor2*panelWidth2)/2)+'px';	
    var panelTop2 = parseInt((window.innerHeight-factor2*panelHeight2)/2)+'px';
	document.getElementById("navigatorText").innerHTML = thisPic + 1 +"/" + myComic.panels.length; 
	for (var counter = 0; counter <= transitionSteps; counter++) {
		panelTransitionTable[counter].factor = factor1+(counter/transitionSteps)*(factor2-factor1);
		panelTransitionTable[counter].panelLeft = parseInt(parseInt(panelLeft1)+(counter/transitionSteps)*(parseInt(panelLeft2)-parseInt(panelLeft1)))+'px';
		panelTransitionTable[counter].panelTop = parseInt(parseInt(panelTop1)+(counter/transitionSteps)*(parseInt(panelTop2)-parseInt(panelTop1)))+'px';
		panelTransitionTable[counter].panelWidth = parseInt(parseInt(panelWidth1)+(counter/transitionSteps)*(parseInt(panelWidth2)-parseInt(panelWidth1)))+'px';
		panelTransitionTable[counter].panelHeight = parseInt(parseInt(panelHeight1)+(counter/transitionSteps)*(parseInt(panelHeight2)-parseInt(panelHeight1)))+'px';
//		panelTransitionTable[counter].widthPrct = (100*factor*myComic.panels[thisPic].width/window.innerWidth)+'%';
		panelTransitionTable[counter].widthPrct = parseInt(100*panelTransitionTable[counter].factor*myComic.panels[thisPic-1].width/window.innerWidth)+'%';
	}
	setTimeout(function() {panelTransition(1)},transitionStepDelay);
}	

function closePage(counter) {
	if (counter > -1) { //  
	fadeImages[counter].style.display = 'block'; 
	setTimeout(function() {closePage(counter-1)},pageTransitionStepDelay);
	} else { 
		document.getElementById("pictureFrame").style.width = '0px';
		document.getElementById("pictureFrame").style.borderLeftWidth = '0px';
		document.getElementById("pictureFrame").style.borderRightWidth = window.innerWidth+'px';
		document.getElementById("myPicture").src = comicFolder+""+myComic.panels[thisPic].pimage; 
		document.getElementById("myPicture").style.display = 'none'; // hide image until changePage is called by displayPanel() after image.onload
		document.getElementById("pictureFrame").style.backgroundImage = "none";
		}
	}

function openPage(counter) {
	if (counter > -1) { //  
		fadeImages[counter].style.display = 'none'; 
		setTimeout(function() {openPage(counter-1)},pageTransitionStepDelay*3);
		}
	}

function changePage() {
	savedImageSrc = myComic.panels[thisPic].pimage; // save the name if the image file
	document.getElementById("myPicture").style.display = 'block'; // makes image visible
	var heightFactor = 1;
	var widthFactor = 1;
	factor = 1;
	panelWidth = myComic.panels[thisPic].subImage.width;
	panelHeight = myComic.panels[thisPic].subImage.height;		
	document.getElementById("navigatorText").innerHTML = thisPic + 1 +"/" + myComic.panels.length; 
	if (window.innerWidth < panelWidth) widthFactor = window.innerWidth/panelWidth;
	if (window.innerHeight < panelHeight) heightFactor = window.innerHeight/panelHeight;
	if (heightFactor < widthFactor) {factor = heightFactor;} else {factor = widthFactor;}
	document.getElementById("myPicture").style.width = parseInt(100*factor*myComic.panels[thisPic].width/window.innerWidth)+'%';	
	panelLeft = parseInt((window.innerWidth-factor*panelWidth)/2)+'px';	
    panelTop = parseInt((window.innerHeight-factor*panelHeight)/2)+'px';
	document.getElementById("myPicture").style.left = (parseInt(panelLeft)-factor*myComic.panels[thisPic].subImage.x)+'px';
    document.getElementById("myPicture").style.top = (parseInt(panelTop)-factor*myComic.panels[thisPic].subImage.y)+'px';
	setTimeout(drawPictureFrame,newPageDelay);
	pageTransitionOn = false; // todo: check if needed
	openPage(pageTransitionSteps);
	return false;	
	}
	
function preparePanel() { // only used when showing previous panel and changing page
	var heightFactor = 1;
	var widthFactor = 1;
	factor = 1;
	if (myComic.panels[thisPic].subImage) {
		panelWidth = myComic.panels[thisPic].subImage.width;
		panelHeight = myComic.panels[thisPic].subImage.height;		
		} else {
		panelWidth = myComic.panels[thisPic].width;
		panelHeight = myComic.panels[thisPic].height;		
		}
	document.getElementById("navigatorText").innerHTML = thisPic + 1 +"/" + myComic.panels.length; 
	document.getElementById("myPicture").src = comicFolder+""+myComic.panels[thisPic].pimage; 
	if (window.innerWidth < panelWidth) widthFactor = window.innerWidth/panelWidth;
	if (window.innerHeight < panelHeight) heightFactor = window.innerHeight/panelHeight;
	if (heightFactor < widthFactor) {factor = heightFactor;} else {factor = widthFactor;}

	document.getElementById("myPicture").style.width = parseInt(100*factor*myComic.panels[thisPic].width/window.innerWidth)+'%';
	
	panelLeft = parseInt((window.innerWidth-factor*panelWidth)/2)+'px';	
    panelTop = parseInt((window.innerHeight-factor*panelHeight)/2)+'px';
	if (myComic.panels[thisPic].subImage) {
		document.getElementById("myPicture").style.left = (parseInt(panelLeft)-factor*myComic.panels[thisPic].subImage.x)+'px';
        document.getElementById("myPicture").style.top = (parseInt(panelTop)-factor*myComic.panels[thisPic].subImage.y)+'px';
    }
    else {
        document.getElementById("myPicture").style.left = panelLeft;
        document.getElementById("myPicture").style.top = panelTop;
    }
        drawPictureFrame();
	if (myComic.panels[thisPic].pimage == savedImageSrc) displayPanel(); // if using the same image file for this and the previous panel, displayPanel() does not get called by onLoad
	savedImageSrc = myComic.panels[thisPic].pimage; // save the name if the image file
	
	openPage(pageTransitionSteps);
	
	return false;	
	}	
	
function drawPictureFrame() {
		document.getElementById("pictureFrame").style.width = parseInt(factor*parseInt(panelWidth))+'px';
		document.getElementById("pictureFrame").style.height = parseInt(factor*parseInt(panelHeight))+'px';		
		document.getElementById("pictureFrame").style.borderTopWidth = panelTop;		
		document.getElementById("pictureFrame").style.borderLeftWidth = panelLeft;		
        document.getElementById("pictureFrame").style.borderBottomWidth =  parseInt(5+window.innerHeight-parseInt(panelTop)-factor*parseInt(panelHeight))+'px'; // additional pixels added to prevent roundation errors in zoom out view
        document.getElementById("pictureFrame").style.borderRightWidth = parseInt(5+window.innerWidth-parseInt(panelLeft)-factor*parseInt(panelWidth))+'px'; // additional pixels added to prevent roundation errors in zoom out view
		}

function displayPanel() { // called by image's onload 
	if (myComic.panels[thisPic].pimage == savedImageSrc) { 
		document.getElementById("myPicture").style.display = 'block'; // makes image visible
//		alert("quick image change");
		return false;
	}
	changePage();
	document.getElementById("myPicture").style.display = 'block'; // makes image visible
return false;
	}
	
function isPortrait() {
	if (window.innerHeight > window.innerWidth) {return true;} else {return false;}
}

function reDrawLayout() {	
	for (var j=0; j <= pageTransitionSteps; j++) { // set up fade in/out images table
		if (isPortrait()) fadeImages[j].width = window.innerHeight;
		else fadeImages[j].width = window.innerWidth;
	}
}

function windowResize () { // is called always when orientation is changed, by user 
		reDrawLayout();
		preparePanel();
		return false;
	}
	
function hideTapGuide() {
	document.getElementById("nextLinkImage").style.display = 'none'; 	
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

// Localization
var english = {
	"get_more_comics": "Get More Comics!",
        "mobile_comics_reader": "Software &copy; Mobcomics LLC 2012",
	"exit": "Exit",
}

var spanish = {
	"get_more_comics": "Más Comics",
        "mobile_comics_reader": "Software copyright &copy; Mobcomics LLC 2012",
	"exit": "Salir",
}

var german = {
	"get_more_comics": "Mehr Comics!",
        "mobile_comics_reader": "Software copyright &copy; Mobcomics LLC 2012",
	"exit": "Schließen",
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

function loadScript(){
	comicFolder = comics.comicsList[gup('comic')].folderUrl;
    var script = document.createElement("script")
    script.type = "text/javascript";
    script.onload = function(){
//		console.log("comicDataLoaded");
		comicDataLoaded = true;
		if (windowLoaded) continueInit();
    };
    script.src = comicFolder+""+comics.comicsList[gup('comic')].dataFile;
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

function setBrowserStoragePanelNumber() {
	if (localStorage.currentPanel2 != undefined) panelPointer = JSON.parse(localStorage.currentPanel2);	
	if (thisPic != myComic.panels.length) panelPointer[currentComic] = thisPic+1;
	localStorage.currentPanel2 = JSON.stringify(panelPointer);
}

function resetBrowserStoragePanelNumber() {
	if (localStorage.currentPanel2 != undefined) panelPointer = JSON.parse(localStorage.currentPanel2);	
	panelPointer[currentComic] = 0;
	localStorage.currentPanel2 = JSON.stringify(panelPointer);
}

function setBrowserStorageAutoplay(set) {
	if (set) localStorage.autoplay = "1";
	else localStorage.autoplay = "0";
}

function browserStorageAutoplay() {
	if (localStorage.autoplay == "1") {
		return true;
	}
	else return false;
}
