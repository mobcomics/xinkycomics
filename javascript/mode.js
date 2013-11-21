$(window).load(function() { init(); });

function init() {
	window.addEventListener("orientationchange", checkOrientation, false);
//	alert($("#actualFrame").width);
	$("#actualFrame").css("width", $("#body").innerWidth()+"px");
	$("#actualFrame").css("height", "1000px");
}

function checkOrientation () {
	$("#actualFrame").css("width", $("#body").innerWidth()+"px");	
}