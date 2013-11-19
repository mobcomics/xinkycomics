// JavaScript Document


// PC browser

var browser = {
	"pc": {
//		"windowWidthAddition": 5,
//		"windowHeightAddition": 40,
		"portrait": {
			"windowWidthAddition": 5,
			"windowHeightAddition": 40,
		},
		"landscape":{
			"windowWidthAddition": 20,
			"windowHeightAddition": 70,	
		}	
	}
}

// iPhone, not up to date
/*var deviceiPhone = {
	"type": "iPhone",
	"panelWidth": 300, "panelHeight": 338, 
	"panelWidthLandscape": 450, "panelHeightLandscape": 300, // check if broken
	"displayWidth": 320, "displayHeight": 480,
	"portrait": {
		"getMore": {
			"left": 10,
			"top": -12
			},
		"panelChangeButton": {
			"panelTop": 40,
			"size": 40,
			"top": 425,
			"left": 30,
			"right": 30
			}, 
		"coverStartButton": {
			"size": 40,
			"top": 430,
			"right": 30
			} 
		},
	"landscape": {
		"getMore": {
			"left": 10,
			"top": -40
			},
		"panelTop": 5,
		"panelChangeButton": {
			"size": 40,
			"top": 150,
			"left": 5,
			"right": 5
			}, 
		"coverStartButton": {
			"size": 40,
			"top": 300,
			"right": 30
			} 
		}, 		
	}; 
*/
// N97
var deviceN97 = {
	"type": "N97",
	"panelWidth": 345, "panelHeight": 388, 
	"panelWidthLandscape": 510, "panelHeightLandscape": 340,
	"displayWidth": 360, "displayHeight": 640,
	"portrait": {
		"menuArea": {
			"top": 450
			},
		"panelTop": 100,
		"coverPanelTop": 50,
		"panelChangeButton": {
			"size": 40,
			"top": 550,
			"left": 30,
			"right": 30
			}, 
		"coverStartButton": {
			"size": 40,
			"top": 500,
			"right": 50
			} 
		},
	"landscape": {
		"menuArea": {
			"top": 100
			},
		"panelTop": 0,
		"panelChangeButton": {
			"size": 40,
			"top": 150,
			"left": 5,
			"right": 5
			}, 
		"coverStartButton": {
			"size": 40,
			"top": 160,
			"right": 30
			} 
		}, 		
	}; 

var device = deviceN97;
var orientationControlled = false;
var softkeyControlled = true;
