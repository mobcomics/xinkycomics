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
	$.mobile.loading( 'hide');
	document.getElementById("description").innerHTML = editor.description;
	document.getElementById("post").innerHTML = editor.post;
	$("#editor").html("Stahlhandske");
//	jQuery( window ).on( "swipe", function( event ) {
//		$("#editor").html("zipe");								   
//	});
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

/* <script type="text/javascript" src="http://mobcomics.com/zines/angry/config.js">
 </script>
 */
