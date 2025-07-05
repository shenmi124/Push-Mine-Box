function getInterval(){
}

var OFFLINETIME = new Date()
var TIMESTART = new Date()
setInterval(function(){
	T = new Date()
	player.data.offline = n((Number(T.getTime())))
	DIFF = n(Math.min((Number(T.getTime())-TIMESTART)/1000,1e100))
	var OFFLINEBOOST = n(1).mul(player.data.devSpeed)
	DIFF=DIFF.mul(OFFLINEBOOST)
	TIMESTART=T.getTime()
	
	getInterval()
}, 50)