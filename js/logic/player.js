let FlagPosition = [1, -1, 100, -100, 101, -101, 99, -99]

let PlayerPosition = []
let CluePosition = []
let WinPosition = []

function getPosition(){
    PlayerPosition = []
    CluePosition = []
    WinPosition = []
    for(let i in player.mine.grid){
        if(player.mine.grid[i]['item']=='arrow'){
            if(player.mine.grid[i]['data']){
                PlayerPosition.push(i)
            }
        }
        if(player.mine.grid[i]['item']=='clue'){
            CluePosition.push(i)
        }
        if(player.mine.grid[i]['wall']=='win'){
            WinPosition.push(i)
        }
    }
}

function getRightClue(id){
    let canWin = true
    let flagNum = 0
    for(let flag in FlagPosition){
        if(player.mine.grid[Number(id)+FlagPosition[flag]]['item']=='mine'){
            flagNum++
        }
    }
    if(n(player.mine.grid[id]['data']).neq(flagNum)){
        canWin = false
    }
    if(n(player.mine.grid[id]['data']).lt(flagNum)){
        return 'more'
    }
    return canWin
}

function getComplete(id){
    let level = id[0]+'/'+id[1]
    if(player.mine.completeLevel.indexOf(level)!==-1){
        return true
    }
    return false
}

function getCanWin(){
    let canWin = true
    for(let i in CluePosition){
        if(getRightClue(CluePosition[i])!==true){
            canWin = false
        }
    }
    return canWin
}

function getCanMove(type, position, move){
    let movePosition = Number(position)+move

    let wallType = player.mine.grid[movePosition]['wall']
    let itemType = player.mine.grid[movePosition]['item']

    if(wallType=='win'){
        if(getCanWin()){
            wallType = 'blank'
        }else{
            wallType = 'none'
        }
    }

    if(wallType=='none'){
        return false
    }

    if(itemType=='box'){
        let canMove = getCanMove('box', movePosition, move)
        if(canMove){
            playerPushBox('box', movePosition, move)
        }
        return canMove
    }
    if(itemType=='clue'){
        if(getRightClue(movePosition)=='more'){
            return false
        }

        let canMove = getCanMove('clue', movePosition, move)
        if(canMove){
            playerPushBox('clue', movePosition, move)
        }
        return canMove
    }
    if(itemType=='mine'){
        if(type=='arrow' && wallType!=='none'){
            playerDie('mine', movePosition, move)
            return false
        }

        let canMove = getCanMove('mine', movePosition, move)
        if(canMove){
            playerPushBox('mine', movePosition, move)
        }
        return canMove
    }

    return true
}

function playerMove(type, position, move){
    player.mine.grid[Number(position)+move]['item'] = type
    player.mine.grid[Number(position)+move]['data'] = player.mine.grid[position]['data']

    player.mine.grid[position]['item'] = 'none'
    player.mine.grid[position]['data'] = 'none'
}

function playerPushBox(type, boxPosition, move){
    player.mine.grid[boxPosition+move]['item'] = player.mine.grid[boxPosition]['item']
    player.mine.grid[boxPosition+move]['data'] = player.mine.grid[boxPosition]['data']

    player.mine.grid[boxPosition]['item'] = 'none'
    player.mine.grid[boxPosition]['data'] = 'none'

    if(type=='box'){
        stepsAdded += 'b'
    }else if(type=='clue'){
        stepsAdded += 'c'
    }else if(type=='mine'){
        stepsAdded += 'm'
    }
}

function playerDie(type, position, move){
    player.mine.grid[position]['item'] = 'arrow'
    player.mine.grid[position]['data'] = false
    player.mine.grid[Number(position)-move]['item'] = 'none'
    player.mine.grid[Number(position)-move]['data'] = 'none'
    
    if(type=='mine'){
        stepsLocation.push(position)
        stepsAdded += 'D'
        steps.push(stepsAdded)
        stepsTimes += 1
    }
}

function timePast(direction){
    if(canTimePast){
        stepsAdded = direction
        getPosition()
    
        let move = 0
        if(direction=='w'){move = -100}
        if(direction=='a'){move = -1}
        if(direction=='s'){move = 100}
        if(direction=='d'){move = 1}
    
        if(PlayerPosition.length==0){
            stepsAdded = ''
        }
    
        for(let i in PlayerPosition){
            let canMove = getCanMove('arrow', PlayerPosition[i], move)
            if(canMove && !(!getComplete(player.mine.grid[PlayerPosition[i]]['meta']) && player.mine.grid[PlayerPosition[i]]['wall']=='enter' && player.mine.grid[PlayerPosition[i]]['item']=='arrow')){
                stepsLocation.push(Number(PlayerPosition[i])+move)
                playerMove('arrow', PlayerPosition[i], move)
            }else{
                stepsAdded = ''
            }
        }
    
        if(stepsAdded!==''){
            steps.push(stepsAdded)
            stepsTimes += 1
            stepsAdded = ''
        }
    
        for(let i in WinPosition){
            player.mine.grid[WinPosition[i]]['wall'] = 'blank'
            player.mine.grid[WinPosition[i]]['wall'] = 'win'
        }
        
        getPosition()
    }
}