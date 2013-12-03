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

function checkAndAddDailyCredits() {
	var dailyCreditAmount = 50;
	var currentDate = new Date();	
	if (localStorage.daily == undefined) { // if no daily credit received ever, give some
		localStorage.daily = JSON.stringify(currentDate.toDateString());
		console.log("new user, give daily credit");
		addCredits(dailyCreditAmount);
		return dailyCreditAmount;
	}
	var lastDate = new Date(localStorage.daily);
	console.log("lastdate "+lastDate.toDateString());
	console.log("currentdate "+currentDate.toDateString());
	if (currentDate.valueOf() > lastDate.valueOf() && lastDate.toDateString() != currentDate.toDateString()) {
		console.log("old user, give daily credit");
		localStorage.daily = JSON.stringify(currentDate.toDateString());
		addCredits(dailyCreditAmount);
		return dailyCreditAmount;		
	}
	console.log("old user, already received daily credit");
	return null;			
}
