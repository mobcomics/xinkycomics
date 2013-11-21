$(window).load(function() { init(); });

function init() {
//	alert($("#actualFrame").width);
	$("#actualFrame").css("width", $("#body").innerWidth()+"px");
	$("#actualFrame").css("height", "1000px");
}