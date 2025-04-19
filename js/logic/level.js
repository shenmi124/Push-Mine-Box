let steps = []
let stepsLocation = []
let stepsTimes = -1
let stepsAdded = ''

function startData(){
    return {
        wall: 'none',
        item: 'none',
        data: 'none',
        meta: 'none',
        info: 'none',
    }
}

function editInput(){
    edit({
        type: document.getElementById("editType").value,
        choose: document.getElementById("editChoose").value,
        data: document.getElementById("editData").value,
        meta: [document.getElementById("editMetaMain").value, document.getElementById("editMetaSide").value],
        info: document.getElementById("editInfo").value
    })
}

function edit(Class){
    document.getElementById("editType").value = player.mine.type = Class.type ?? 'none'
    document.getElementById("editChoose").value = player.mine.choose = Class.choose ?? 'none'
    document.getElementById("editData").value = player.mine.data = Class.data ?? 'none'
    player.mine.meta = Class.meta ?? 'none'
    if(player.mine.meta!=='none'){
        document.getElementById("editMetaMain").value = player.mine.meta[0]
        document.getElementById("editMetaSide").value = player.mine.meta[1]
    }else{
        document.getElementById("editMetaMain").value = document.getElementById("editMetaSide").value = 'none'
    }
    document.getElementById("editInfo").value = player.mine.info = Class.info ?? 'none'
}

function resetLevel(){
    for(let i in player.mine.grid){
        player.mine.grid[i] = startData()
    }
    
    player.mine.levelRows = n(18)
    player.mine.levelCols = n(33)
}

function exportData(data){
	let str = data

	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
	el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);
}

function outputLevel(){
    let output = {
        data: {},
        level: {},
    }
    for(let i in player.mine.grid){
        for(let data in player.mine.grid[i]){
            if(player.mine.grid[i][data]!=='none'){
                output['level'][i] ??= {}
                output['level'][i][data] = player.mine.grid[i][data]
            }
        }
    }
    output['data']['row'] = player.mine.levelRows
    output['data']['col'] = player.mine.levelCols
    console.log(player.mine.lastLevel+': '+JSON.stringify(output)+',')
    exportData(player.mine.lastLevel+': '+JSON.stringify(output)+',')
    return output
}

function enterLevel(){
    for(let i in PlayerPosition){
        if(player.mine.grid[PlayerPosition[i]]['wall']=='enter'){
            inputLevel(player.mine.grid[PlayerPosition[i]]['meta'][0], player.mine.grid[PlayerPosition[i]]['meta'][1])
        }
        if(player.mine.grid[PlayerPosition[i]]['wall']=='win'){
            if(player.mine.completeLevel.indexOf(player.mine.lastWorld+'/'+player.mine.lastLevel)==-1){
                player.mine.completeLevel.push(player.mine.lastWorld+'/'+player.mine.lastLevel)
            }
            inputLevel(player.mine.grid[PlayerPosition[i]]['meta'][0], player.mine.grid[PlayerPosition[i]]['meta'][1])
        }
    }
}

function inputLevel(world, level){
    resetLevel()
    let input = All[world][level]
    for(let i in input['level']){
        for(let type in input['level'][i]){
            player.mine.grid[i][type] = input['level'][i][type]
        }
    }
    player.mine.levelRows = n(input['data']['row'])
    player.mine.levelCols = n(input['data']['col'])

    steps = []
    stepsLocation = []
    stepsTimes = -1
    stepsAdded = ''

    player.mine.lastWorld = world
    player.mine.lastLevel = level

    getPosition()
}

function quitLevel(){
    inputLevel('world0', 'world')
}

var canTimePast = true
function undo(){
    if(canTimePast){
        if(stepsTimes>=0){
            let doing = steps[stepsTimes]
            let location = stepsLocation[stepsTimes]
    
            let move = 0
            if(doing[0]=='w'){move = 100}
            if(doing[0]=='a'){move = 1}
            if(doing[0]=='s'){move = -100}
            if(doing[0]=='d'){move = -1}
    
            for(let str = 0; str <= doing.length; str++){
                let data = doing[str]
                if(data=='b'){
                    canTimePast = false
                    setTimeout(function(){
                        playerPushBox('box', location-(move*str), move)
                        canTimePast = true
                    },0)
                    continue
                }
                if(data=='c'){
                    canTimePast = false
                    setTimeout(function(){
                        playerPushBox('clue', location-(move*str), move)
                        canTimePast = true
                    },0)
                    continue
                }
                if(data=='m'){
                    canTimePast = false
                    setTimeout(function(){
                        playerPushBox('mine', location-(move*str), move)
                        canTimePast = true
                    },0)
                    continue
                }
                if(data=='D'){
                    canTimePast = false
                    setTimeout(function(){
                        player.mine.grid[location]['item'] = 'mine'
                        canTimePast = true
                    },0)
                    continue
                }
                playerMove('arrow', location, move)
            }
            getPosition()
    
            steps = steps.slice(0, stepsTimes)
            stepsLocation = stepsLocation.slice(0, stepsTimes)
            stepsTimes -= 1
        }
    }
}