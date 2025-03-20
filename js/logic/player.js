let playerPosition = []
let cluePosition = []
let winPosition = []

function getPosition(){
    playerPosition = []
    cluePosition = []
    winPosition = []
    for(let i in player.mine.grid){
        if(player.mine.grid[i]['item']=='arrow'){
            if(player.mine.grid[i]['data']){
                playerPosition.push(i)
            }
        }
        if(player.mine.grid[i]['item']=='clue'){
            cluePosition.push(i)
        }
        if(player.mine.grid[i]['wall']=='win'){
            winPosition.push(i)
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
    if(n(player.mine.grid[id]['data']).lt(flagNum)){
        return 'more'
    }
    return canWin
}

function getCanWin(){
    let canWin = true
    for(let i in cluePosition){
        if(getRightClue(cluePosition[i])!==true){
            canWin = false
        }
    }
    return canWin
}

function getCanMove(playerPosition, move, type){
    let canMove = true
    let position = Number(playerPosition)+move
    if(player.mine.grid[position]['item']=='mine'){
        if(type=='player'){
            player.mine.grid[position]['item'] = 'arrow'
            player.mine.grid[position]['data'] = false
            player.mine.grid[playerPosition]['item'] = 'none'
            player.mine.grid[playerPosition]['data'] = 'none'
            return
        }

        canMove = getCanMove(position, move, 'clue')
        if(canMove){
            playerPushBox(position, move)
        }
    }
    if(player.mine.grid[position]['item']=='clue'){
        if(getRightClue(position)=='more'){
            return false
        }

        canMove = getCanMove(position, move, 'clue')
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
        }else if(type=='player'){
            inputLevel(player.mine.grid[position]['meta'][0], player.mine.grid[position]['meta'][1])
            return false
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
        let canMove = getCanMove(playerPosition[i], move, 'player')
        if(canMove){
            player.mine.grid[Number(playerPosition[i])+move]['item'] = 'arrow'
            player.mine.grid[Number(playerPosition[i])+move]['data'] = player.mine.grid[playerPosition[i]]['data']

            player.mine.grid[playerPosition[i]]['item'] = 'none'
            player.mine.grid[playerPosition[i]]['data'] = 'none'
        }
    }

    for(let i in winPosition){
        player.mine.grid[winPosition[i]]['wall'] = 'blank'
        player.mine.grid[winPosition[i]]['wall'] = 'win'
    }
    
    getPosition()
}