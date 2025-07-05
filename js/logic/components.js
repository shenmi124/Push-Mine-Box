var components = {
    wall: {
        information: {
            canMove(){return true},
            draw: {
                fill(){return '#fff0'},
                text(){return '?'},
                textSize(){return 3},
                textColor(){return 'blue'}
            },
        },
        wall: {
            canMove(){return false},
            draw: {
                fill(){return 'lightgrey'}
            },
        },
        blank: {
            canMove(){return true},
            draw: {
                fill(){return '#fff0'},
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
                text(x, y){return World[player.data.grid['x'+x+'y'+y].wall.code]?.data?.name ?? player.data.grid['x'+x+'y'+y].wall.code},
                textSize(x, y){return 3 * (World[player.data.grid['x'+x+'y'+y].wall.code]?.data?.name?.length ?? player.data.grid['x'+x+'y'+y].wall.code.length)}
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
                fill(){return 'grey'},
            },
        },
        clue: {
            canMove(x, y){return getFlagAmount(x, y)!=='danger'},
            draw: {
                position(){return Position.CluePosition},
                shapes(){return 'rect'},
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