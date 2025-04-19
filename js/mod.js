let modInfo = {
	name: "Push Mine & Box",
	nameI18N: "Push Mine & Box",// When you enabled the internationalizationMod, this is the name in the second language
	id: "PushMineBox",
	author: "辉影神秘",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js", 'logic/edit.js', 'logic/level.js', 'logic/player.js', 'level/world0.js'],

	internationalizationMod: false,
	// When enabled, it will ask the player to choose a language at the beginning of the game
	changedDefaultLanguage: true,
	// Changes the mod default language. false -> English, true -> Chinese

	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

var colors = {
	button: {
		width: '150px',// Table Button
		height: '40px',// Table Button
		font: '25px',// Table Button
		border: '3px'// Table Button
	},
	default: {
		1: "#ffffff",//Branch color 1
		2: "#bfbfbf",//Branch color 2
		3: "#7f7f7f",//Branch color 3
		color: "#000",
		points: "#ffffff",
		locked: "#bf8f8f",
		background: "#E5E5E5",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
}

// When enabled, it will hidden left table
function hiddenLeftTable(){
	return true && !player.mine.console
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Push Mine",
}

function changelog(){
	return i18n(`
		`, `
	`, false)
} 

function n(num){
	return new Decimal(num)
}

function winText(){
	return i18n(`你暂时完成了游戏!`, `Congratulations! You have reached the end and beaten this game, but for now...`, false)
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra information at the top of the page
var displayThings = [
	function() {
		if(options.ch==undefined && modInfo.internationalizationMod==true){return '<big><br>You should choose your language first<br>你需要先选择语言</big>'}
		return '<div class="res">'+displayThingsRes()+'</div><br><div class="vl2"></div></span>'
	}
]

// You can write code here to easily display information in the top-left corner
function displayThingsRes(){
	return 'Points: '+format(player.points)+' | '
}

// Determines when the game "ends"
function isEndgame() {
	return false
}

function getPointsDisplay(){
	return ''
}

// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
