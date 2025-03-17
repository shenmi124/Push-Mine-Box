let playerPosition = []
let cluePosition = []

function getPosition(){
    playerPosition = []
    cluePosition = []
    for(let i in player.mine.grid){
        if(player.mine.grid[i]['item']=='arrow'){
            playerPosition.push(i)
        }
        if(player.mine.grid[i]['item']=='clue'){
            cluePosition.push(i)
        }
    }
}

function getRightClue(id){
    let canWin = true
    let flagPosition = [1, -1, 100, -100, 101, -101, 99, -99]
    let flagNum = 0
    for(let flag in flagPosition){
        if(player.mine.grid[Number(id)+flagPosition[flag]]['item']=='mine'){
            flagNum++
        }
    }
    if(n(player.mine.grid[id]['data']).neq(flagNum)){
        canWin = false
    }
    return canWin
}

function getCanWin(){
    let canWin = true
    for(let i in cluePosition){
        canWin = getRightClue(cluePosition[i])
    }
    return canWin
}

function getCanMove(playerPosition, move){
    let canMove = true
    let position = Number(playerPosition)+move
    if(player.mine.grid[position]['item']=='clue'){
        canMove = getCanMove(position, move)
        if(canMove){
            playerPushBox(position, move)
        }
    }
    if(player.mine.grid[position]['wall']=='none'){
        canMove = false
    }
    if(player.mine.grid[position]['wall']=='win'){
        if(!getCanWin()){
            canMove = false
        }else{
            inputLevel(player.mine.grid[position]['data'][0], player.mine.grid[position]['data'][1])
        }
    }
    return canMove
}

function playerPushBox(boxPosition, move){
    player.mine.grid[boxPosition+move]['item'] = player.mine.grid[boxPosition]['item']
    player.mine.grid[boxPosition+move]['data'] = player.mine.grid[boxPosition]['data']

    player.mine.grid[boxPosition]['item'] = 'none'
    player.mine.grid[boxPosition]['data'] = 'none'
}

function playerMove(direction){
    getPosition()

    let move = 0
    if(direction=='w'){move = -100}
    if(direction=='a'){move = -1}
    if(direction=='s'){move = 100}
    if(direction=='d'){move = 1}
    for(let i in playerPosition){
        let canMove = getCanMove(playerPosition[i], move)
        if(canMove){
            player.mine.grid[playerPosition[i]]['item'] = 'none'
            player.mine.grid[Number(playerPosition[i])+move]['item'] = 'arrow'
        }
    }
    
    getPosition()
}