/**
 * 
 */

function addCredits(c) {
	var credits = 0;
	if (localStorage.dits != undefined) credits = JSON.parse(localStorage.dits);	
	localStorage.dits = JSON.stringify(credits+c);
	console.log(localStorage.dits);
	showCredits();
}

function readCredits() {
	var credits = 0;
	if (localStorage.dits != undefined) credits = JSON.parse(localStorage.dits);	
	return credits;
}

function showCredits() {
	$("#creditsLine").html("You have <span style='font-weight:bold;'>"+readCredits()+" panel credits</span> left");	
}
