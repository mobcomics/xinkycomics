/**
 * 
 */

function addCredits(c) {
	var credits = 0;
	if (localStorage.dits != undefined) credits = JSON.parse(localStorage.dits);	
	localStorage.dits = JSON.stringify(credits+c);
	console.log(localStorage.dits);
}

function readCredits() {
	var credits = 0;
	if (localStorage.dits != undefined) credits = JSON.parse(localStorage.dits);	
	return credits;
}

function useCredits(c) {
	var credits = 0;
	if (localStorage.dits != undefined) credits = JSON.parse(localStorage.dits);	
	localStorage.dits = JSON.stringify(credits-c);
	console.log("credits: "+localStorage.dits);
}
