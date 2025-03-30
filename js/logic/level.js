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

function edit(Class){
    for(let i in startData()){
        player.mine[i] = Class[i] ?? 'none'
    }
}

function resetLevel(){
    for(let i in player.mine.grid){
        player.mine.grid[i] = startData()
    }
    
    player.mine.levelRows = n(18)
    player.mine.levelCols = n(33)
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
    console.log(output)
    return output
}

function enterLevel(){
    for(let i in PlayerPosition){
        if(player.mine.grid[PlayerPosition[i]]['wall']=='win'){
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

function undo(){
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
                setTimeout(function(){
                    playerPushBox('box', location-(move*str), move)
                },0)
                continue
            }
            if(data=='c'){
                setTimeout(function(){
                    playerPushBox('clue', location-(move*str), move)
                },0)
                continue
            }
            if(data=='m'){
                setTimeout(function(){
                    playerPushBox('mine', location-(move*str), move)
                },0)
                continue
            }
            if(data=='D'){
                setTimeout(function(){
                    player.mine.grid[location]['item'] = 'mine'
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