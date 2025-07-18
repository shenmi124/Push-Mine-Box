var Position = {
    ArrowPosition: [],

    PlayerPositon: [],
    DeadPlayerPositon: [],
    BoxPosition: [],
    QuantumBoxPosition: [],
    CluePosition: [],
    FlagPosition: [],

    EnterPosition: [],
}

var AnimationItem = []

var MaxRow = 0
var MinRow = 0
var MaxCol = 0
var MinCol = 0

function getPosition(){
    for(let i in Position){
        Position[i] = []
    }

    for(let id in player.data.grid){
        for(let type in player.data.grid[id]){
            let positionX = player.data.grid[id][type]['position'][0]
            let positionY = player.data.grid[id][type]['position'][1]
            getScreenSize(positionX, positionY)

            if(player.data.grid[id][type]['arrow'] ?? false){
                Position.ArrowPosition.push([positionX, positionY])
            }

            if(type=='item'){
                for(let i in components.item){
                    if(player.data.grid[id][type]['type']==i){
                        let data = components.item[i].draw.position()
                        data.push([positionX, positionY])
                    }
                }
            }
        }
    }

    changeScreenSize()
}

function getScreenSize(col, row){
    MaxCol = Math.max(MaxCol, col + 2)
    MinCol = Math.min(MinCol, col - 2)

    MaxRow = Math.max(MaxRow, row + 2)
    MinRow = Math.min(MinRow, row - 2)
}

function changeScreenSize(){
    let col = MaxCol - MinCol + 1
    let row = MaxRow - MinRow + 1
    player.data.colSize = n(col)
    player.data.rowSize = n(row)
}