$(window).load(function() { init(); });
window.onresize = resizeIframe;

function init() {
	$("#actualFrame").css("height", "1000px");
	resizeIframe();
	$("#actualFrame").css("visibility", "block");	
}

function resizeIframe() {
	$("#actualFrame").css("width", $("#body").innerWidth()+"px");	
}