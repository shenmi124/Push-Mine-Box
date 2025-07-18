var components = {
    wall: {
        information: {
            canMove(){return true},
            draw: {
                fill(){return '#fff'},
                text(){return '?'},
                textSize(){return 3},
                textColor(){return 'blue'}
            },
        },
        wall: {
            canMove(targetPosition, position){
                if(player.data.grid['x'+targetPosition[0]+'y'+targetPosition[1]].item.type=='quantumBox'){
                    return true
                }
                return false
            },
            draw: {
                fill(){return '#e9e9e9'},
                strokeWidth(){return 0},
            },
        },
        blank: {
            canMove(){return true},
            draw: {
                fill(){return '#fff'},
            },
        },
        enter: {
            canMove(){return true},
            blankRule(position){
                if(player.data.grid['x'+position[0]+'y'+position[1]]?.item?.type=='player'){
                    if(player.data.wonlevel.indexOf(player.data.grid['x'+position[0]+'y'+position[1]].wall.code)===-1){
                        return true
                    }
                }
            },
            active(x, y, code){
                return enterLevel([x, y], code)
            },
            draw: {
                fill(x, y){
                    if(player.data.wonlevel.indexOf(player.data.grid['x'+x+'y'+y].wall.code)===-1){
                        return 'lightgreen'
                    }
                    return '#00dd00'
                },
                strokeWidth(){return 0},
                text(x, y){return World[player.data.grid['x'+x+'y'+y].wall.code]?.data?.name ?? player.data.grid['x'+x+'y'+y].wall.code},
                textSize(x, y){return 3}
            },
        },
        finish: {
            canMove(){
                let canMove = true
                for(let i in Position.CluePosition){
                    if(getFlagAmount(Position.CluePosition[i][0], Position.CluePosition[i][1])!=='equal'){
                        canMove = false
                    }
                }
                return canMove
            },
            draw: {
                fill(x, y){
                    let canMove = true
                    for(let i in Position.CluePosition){
                        if(getFlagAmount(Position.CluePosition[i][0], Position.CluePosition[i][1])!=='equal'){
                            canMove = false
                        }
                    }
                    AnimationItem.push(['finishx'+x+'y'+y, 'finish'])
                    document.body.style.setProperty('--LastFinish', document.body.style.getPropertyValue('--Finish'))
                    if(canMove){
                        document.body.style.setProperty('--Finish', 'yellow')
                        return 'yellow'
                    }else{
                        document.body.style.setProperty('--Finish', '#eeee00')
                        return '#eeee00'
                    }
                },
            },
            active(){
                return winLevel()
            },
        }
    },
    item: {
        player: {
            canMove(){return true},
            draw: {
                position(){return Position.PlayerPositon},
                shapes(){return 'circle'},
                strokeWidth(){return 2},
                fill(x, y){
                    if(player.data.grid['x'+x+'y'+y]?.item?.arrow){
                        return 'lightgreen'
                    }
                    return '#fff0'
                }
            },
        },
        deadPlayer: {
            canMove(){return true},
            draw: {
                position(){return Position.DeadPlayerPositon},
                shapes(){return 'circle'},
                strokeWidth(){return 2},
                fill(){
                    return 'lightcoral'
                }
            },
        },
        box: {
            canMove(){return true},
            draw: {
                position(){return Position.BoxPosition},
                shapes(){return 'rect'},
                strokeWidth(){return 2},
                fill(){return 'grey'},
            },
        },
        quantumBox: {
            canMove(targetPosition, position){
                if(player.data.grid['x'+position[0]+'y'+position[1]]?.wall?.type==undefined){
                    if(player.data.grid['x'+targetPosition[0]+'y'+targetPosition[1]].item.arrow){
                        return false
                    }
                }
                return true
            },
            draw: {
                position(){return Position.QuantumBoxPosition},
                shapes(){return 'rect'},
                fill(){return '#ff00ff22'},
            },
        },
        clue: {
            canMove(targetPosition, position){return getFlagAmount(position[0], position[1])!=='danger'},
            draw: {
                position(){return Position.CluePosition},
                shapes(){return 'rect'},
                strokeWidth(){return 2},
                fill(){return '#fff0'},
                text(x, y){return player.data.grid['x'+x+'y'+y].item.code},
                textColor(x, y){
                    if(getFlagAmount(x, y)=='equal'){
                        return 'lightgreen'
                    }else if(getFlagAmount(x, y)=='danger'){
                        return 'lightcoral'
                    }
                    return 'black'
                }
            },
        },
        flag: {
            canMove(){return true},
            rule(targetPosition, position){
                let canMove = false
                if(player.data.grid['x'+position[0]+'y'+position[1]]?.wall){
                    let type = player.data.grid['x'+position[0]+'y'+position[1]].wall.type
                    canMove = components.wall[type].canMove(position[0], position[1])
                }
                if(player.data.grid['x'+targetPosition[0]+'y'+targetPosition[1]].item.type=='player' && canMove){
                    delete player.data.grid['x'+targetPosition[0]+'y'+targetPosition[1]].item
                    delete player.data.grid['x'+position[0]+'y'+position[1]].item
                    addElements(new Elements(position[0], position[1]).setData('item').setType('deadPlayer'))
                    AnimationItem.push(['deadPlayerx'+position[0]+'y'+position[1], 'deadmove'])
                    return true
                }
            },
            draw: {
                position(){return Position.FlagPosition},
                shapes(){return 'rect'},
                strokeWidth(){return 2},
                fill(){return '#fff0'},
                text(){return 'F'},
            },
        }
    }
}

function getFlagAmount(x, y){
    let flag = 0
    for(let adjustmentX = -1; adjustmentX <= 1; adjustmentX++){
        for(let adjustmentY = -1; adjustmentY <= 1; adjustmentY++){
            if(player.data.grid['x'+Number(x+adjustmentX)+'y'+Number(y+adjustmentY)]?.item?.type=='flag'){
                flag++
            }
        }
    }
    if(player.data.grid['x'+x+'y'+y].item.code===flag){
        return 'equal'
    }else if(player.data.grid['x'+x+'y'+y].item.code<flag){
        return 'danger'
    }
    return 'normal'
}

function lastActive(){
    for(let i in Position.ArrowPosition){
        if(player.data.grid['x'+Position.ArrowPosition[i][0]+'y'+Position.ArrowPosition[i][1]]?.wall?.type=='information'){
            getByID('information', player.data.grid['x'+Position.ArrowPosition[i][0]+'y'+Position.ArrowPosition[i][1]].wall.code)
        }else{
            getByID('information', '')
        }
    }
}