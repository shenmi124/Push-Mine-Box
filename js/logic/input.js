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

function outputLevel(name='', level=name, c=true){
    deleteNullObject()
    let output = {
        data: {
            name: name,
            level: level
        },
        level: {},
    }

    let elements = {}
    for(let i in player.data.grid){
        elements[i] = player.data.grid[i]
        for(let type in elements[i]){
            for(let data in elements[i][type]){
                if(elements[i][type][data]==='' || elements[i][type][data]===false){
                    delete elements[i][type][data]
                }
            }
        }
    }
    output.level = elements

    if(c){
        console.log(elements)
        exportData(true)
        exportData(JSON.stringify(output)+',')
    }

    return output
}

function inputLevel(input, quit){
    player.data.grid = {}

    player.data.colSize = n(1)
    player.data.rowSize = n(1)
    
    MaxRow = 0
    MinRow = 0
    MaxCol = 0
    MinCol = 0

    let enterLevelPosition = []
    for(let i in input.level){
        for(let id in input.level[i]){
            let elements = input.level[i][id]
            if(elements.code===undefined){
                elements.code = ''
            }
            if(elements.arrow===undefined){
                elements.arrow = false
            }
            addElements(new Elements(elements.position[0], elements.position[1]).setData(elements.data).setType(elements.type).setCode(elements.code).setArrow(elements.arrow))
            if(elements.arrow){
                enterLevelPosition = [elements.position[0], elements.position[1]]
            }
        }
    }

    if(quit!==undefined){
        if(JSON.stringify(enterLevelPosition)!==JSON.stringify(quit)){
            player.data.grid['x'+enterLevelPosition[0]+'y'+enterLevelPosition[1]].item.setPositon([quit])
            player.data.grid['x'+quit[0]+'y'+quit[1]].item ??= {}
            player.data.grid['x'+quit[0]+'y'+quit[1]].item = player.data.grid['x'+enterLevelPosition[0]+'y'+enterLevelPosition[1]].item
            delete player.data.grid['x'+enterLevelPosition[0]+'y'+enterLevelPosition[1]].item
        }
    }

    LastMove = 'wait'
    timepast()

    createElement.init()
}

function quitLevel(){
    if(player.data.level.length>=2){
        player.data.level.length--
        inputLevel(World[player.data.level[player.data.level.length-1]], player.data.enterLevelPosition[player.data.enterLevelPosition.length-1])
        player.data.enterLevelPosition.length--
    }
}

function winLevel(){
    player.data.wonlevel.push(player.data.level[player.data.level.length-1])
    quitLevel()
    save()
}

function enterLevel(position, input){
    player.data.level.push(input)
    player.data.enterLevelPosition.push(position)
    Undo = []
    inputLevel(World[input])
}

function resetLevel(){
    inputLevel(World[player.data.level[player.data.level.length-1]])
}