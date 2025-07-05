var LastMove = 'wait'
var Undo = []

var CanTimePast = true

function timepast(){
    if(CanTimePast){
        getPosition()

        if(LastMove!=='wait'){
            Undo = Undo.concat([JSON.stringify(outputLevel(World[player.data.level[player.data.level.length-1]].data.name, World[player.data.level[player.data.level.length-1]].data.level, false))])
            if(Undo[Undo.length-1]===Undo[Undo.length-2]){
                Undo.pop()
            }
        }

        if(LastMove=='top' || LastMove=='bottom' || LastMove=='left' || LastMove=='right'){
            playerMove(LastMove)
        }else if(LastMove=='space'){
            playerActive()
        }
        
        deleteNullObject()
    
        createElement.init()

        lastActive()
    }
}

function playerMove(move){
    let adjustment = [0, 0]
    if(move=='top'){
        adjustment = [0, -1]
    }
    if(move=='bottom'){
        adjustment = [0, 1]
    }
    if(move=='left'){
        adjustment = [-1, 0]
    }
    if(move=='right'){
        adjustment = [1, 0]
    }

    function getArrowPositon(x, y){
        player.data.grid['x'+x+'y'+y] ??= {}
        return player.data.grid['x'+x+'y'+y]
    }

    let needMove = []
    function getCanMove(position){
        let getTargetPosition = [position[0]+adjustment[0], position[1]+adjustment[1]]
        let getComponents = getArrowPositon(position[0], position[1])
        let getTarget = getArrowPositon(getTargetPosition[0], getTargetPosition[1])

        let canMove = true
        let wallCanMove = false
        let itemCanMove = true

        for(let i in components){
            if(getComponents[i]!==undefined){
                if(components[i][getComponents[i]['type']].blankRule!==undefined){
                    if(components[i][getComponents[i]['type']].blankRule(position, getTargetPosition)){
                        return false
                    }
                }
            }
            if(getTarget[i]!==undefined){
                if(components[i][getTarget[i]['type']].rule!==undefined){
                    if(components[i][getTarget[i]['type']].rule(position, getTargetPosition)){
                        return false
                    }
                }
                if(i=='wall'){
                    wallCanMove = components[i][getTarget[i]['type']]['canMove'](getTargetPosition[0], getTargetPosition[1])
                }
                if(i=='item'){
                    itemCanMove = components[i][getTarget[i]['type']]['canMove'](getTargetPosition[0], getTargetPosition[1]) && getCanMove(getTargetPosition)
                    if(itemCanMove){
                        needMove.push([position[0]+adjustment[0], position[1]+adjustment[1]])
                    }else{
                        needMove = []
                    }
                }
            }
        }
        return canMove && wallCanMove && itemCanMove
    }

    function getPlayerMove(position){
        let arrow = getArrowPositon(position[0], position[1]).item
        AnimationItem.push([arrow.type+'x'+Number(position[0]+adjustment[0])+'y'+Number(position[1]+adjustment[1]), 'move'])
        if(components.item?.[arrow.type]?.draw?.text!==undefined){
            AnimationItem.push(['text'+arrow.type+'x'+Number(position[0]+adjustment[0])+'y'+Number(position[1]+adjustment[1]), 'move'])
        }
        let targetPosition = getArrowPositon(position[0]+adjustment[0], position[1]+adjustment[1])
        delete getArrowPositon(position[0], position[1]).item
        targetPosition.item = arrow
        targetPosition.item.addPositonX(adjustment[0])
        targetPosition.item.addPositonY(adjustment[1])
    }

    for(let i in Position.ArrowPosition){
        let position = Position.ArrowPosition[i]
        let arrowPosition = getArrowPositon(position[0], position[1])
        if(arrowPosition.item.arrow ?? false){
            if(getCanMove(position)){
                needMove.push(position)
            }
        }
    }

    for(let i in needMove){
        getPlayerMove(needMove[i])
    }
}

function playerActive(){
    function getArrowPositon(x, y){
        player.data.grid['x'+x+'y'+y] ??= {}
        return player.data.grid['x'+x+'y'+y]
    }

    function getPlayerActive(position, wall){
        let type = wall.type
        if(components.wall[type].active!==undefined){
            components.wall[type].active(position[0], position[1], wall.code)
        }
    }

    for(let i in Position.ArrowPosition){
        let position = Position.ArrowPosition[i]
        let arrowPosition = getArrowPositon(position[0], position[1])
        if(arrowPosition.item.arrow ?? false){
            getPlayerActive(position, arrowPosition.wall)
        }
    }
}

function deleteNullObject(){
    for(let i in player.data.grid){
        if(Object.keys(player.data.grid[i]).length===0){
            delete player.data.grid[i]
        }
    }
}