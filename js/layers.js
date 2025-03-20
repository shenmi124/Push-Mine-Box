addLayer("1layer", {
    name: "sideLayer1",
    position: -1,
    row: 0,
    symbol() {return '主要页面'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() {return '主要页面'}, // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled (in mod.js)
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"font-size": "15px", "height": "30px"},// Style for the layer button
    startData() { return {
        unlocked: true,
        points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
    }},
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return true},// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
	tabFormat: [
        ["display-text", function() { return getPointsDisplay() }]
    ],
})

function resetLevel(){
    for(let i in player.mine.grid){
        player.mine.grid[i] = {wall: 'none', item: 'none', data: 'none', meta: 'none'}
    }
}

function outputLevel(){
    let output = {}
    for(let i in player.mine.grid){
        for(let data in player.mine.grid[i]){
            if(player.mine.grid[i][data]!=='none'){
                output[i] ??= {}
                output[i][data] = player.mine.grid[i][data]
            }
        }
    }
    console.log(output)
    return output
}

function inputLevel(world, level){
    resetLevel()
    let input = All[world][level]
    for(let i in input){
        for(let type in input[i]){
            player.mine.grid[i][type] = input[i][type]
        }
    }

    player.mine.lastWorld = world
    player.mine.lastLevel = level

    getPosition()
}

function edit(Class){
    player.mine.type = Class.type ?? 'none'
    player.mine.choose = Class.choose ?? 'none'
    player.mine.data = Class.data ?? 'none'
    player.mine.meta = Class.meta ?? 'none'
}
/*
addLayer("mine", {
    name: "扫雷", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "扫雷", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "扫雷", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),

        console: false,
        type: 'wall',
        choose: 'blank',
        data: 'none'
    }},
    color: "yellow",
    type: "none",
    microtabs: {
        tab: {
            "main": {
                name(){return '主页'},
                nameI18N(){return 'main'},
                content: [
                    'grid',
                    'blank',
                    'blank',
                    'blank',
                ],
            },
        },
    },
    tabFormat: [
       "blank",
       ["microtabs","tab"]
    ],
    layerShown(){return true},
})*/

addLayer("mine", {
    name: "扫雷", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "扫雷", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "扫雷", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),

        lastWorld: 'world0',
        lastLevel: 'level0',

        console: false,
        type: 'wall',
        choose: 'blank',
        data: 'none',
        meta: 'none',
    }},
    color: "yellow",
    type: "none",
    hotkeys: [
        {key: "w", description: "W", onPress(){playerMove('w')}},
        {key: "a", description: "A", onPress(){playerMove('a')}},
        {key: "s", description: "S", onPress(){playerMove('s')}},
        {key: "d", description: "D", onPress(){playerMove('d')}},
    ],
    grid: {
        rows: 15,
        cols: 15,
        getStartData(id){
            return {wall: 'none', item: 'none', data: 'none', meta: 'none'}
        },
        getCanClick(){
            return true
        },
        onClick(data, id){
            if(player.mine.console){
                if(player.mine.grid[id][player.mine.type]==player.mine.choose){
                    player.mine.grid[id][player.mine.type] = 'none'
                }else{
                    player.mine.grid[id][player.mine.type] = player.mine.choose
                    if(player.mine.data!=='none'){
                        player.mine.grid[id]['data'] = player.mine.data
                    }
                }
            }
        },
        getDisplay(data, id){
            if(data['item']=='arrow'){
                if(data['data']){
                    return '<span style="font-size: 32px">♿</span>'
                }else{
                    return '<span style="font-size: 32px">🧊</span>'
                }
            }
            if(data['item']=='clue'){
                if(getRightClue(id)=='more'){
                    return '<span style="color: red">'+format(data['data'], 0)+'</span>'
                }else if(getRightClue(id)){
                    return '<span style="color: yellow">'+format(data['data'], 0)+'</span>'
                }
                if(data['wall']=='blank'){
                    return '<span style="color: white">'+format(data['data'], 0)+'</span>'
                }
                return format(data['data'], 0)
            }
            if(data['item']=='mine'){
                if(data['wall']=='blank'){
                    return '<span style="color: yellow">F</span>'
                }
                return 'F'
            }
            return ''
        },
        getStyle(data, id){
            let background = '#fff'
            let borderColor = '#fff'
            if(data['wall']=='blank'){
                background = '#fff0'
                borderColor = '#fff0'
            }
            if(data['wall']=='win'){
                borderColor = 'green'
                if(getCanWin()){
                    background = '#fff0'
                }
            }
            return {'width': '45px', 'height': '45px', 'border-radius': '0', 'font-size': '38px', background, 'border-color': borderColor}
        },
    },
    clickables: {
        reset: {
            display(){return '重置'},
            canClick(){return true},
            onClick(){
                if(player.mine.lastLevel!=='none'){
                    inputLevel(player.mine.lastWorld, player.mine.lastLevel)
                }else{
                    resetLevel()
                }
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },

        w: {
            display(){return 'W'},
            canClick(){return true},
            onClick(){playerMove('w')},
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },
        a: {
            display(){return 'A'},
            canClick(){return true},
            onClick(){playerMove('a')},
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },
        s: {
            display(){return 'S'},
            canClick(){return true},
            onClick(){playerMove('s')},
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },
        d: {
            display(){return 'D'},
            canClick(){return true},
            onClick(){playerMove('d')},
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },

        save: {
            display(){return '保存'},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                All[player.mine.lastWorld][player.mine.lastLevel] = outputLevel()
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'white'}
            },
        },
        output: {
            display(){return '导出'},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                outputLevel()
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'red'}
            },
        },
        input: {
            display(){return '导入'},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                inputLevel(world=prompt('导入世界名'), level=prompt('导入关卡名'))
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'green'}
            },
        },

        none: {
            display(){return ''},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                edit({
                    type: 'wall',
                    choose: 'blank',
                })
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'white'}
            },
        },
        arrow: {
            display(){return '指针'},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                edit({
                    type: 'item',
                    choose: 'arrow',
                    data: true,
                })
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'white'}
            },
        },
        win: {
            display(){
                if(player.mine.choose=='win'){
                    return '终点<br>'+player.mine.meta
                }
                return '终点'
            },
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                edit({
                    type: 'wall',
                    choose: 'win',
                    meta: [prompt('输入世界名'), prompt('输入关卡名')],
                })
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'white'}
            },
        },
        clue: {
            display(){
                if(player.mine.choose=='clue'){
                    return '线索('+format(player.mine.data, 0)+')'
                }
                return '线索'
            },
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                edit({
                    type: 'item',
                    choose: 'clue',
                    data: n(prompt('输入线索数')).floor()
                })
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'pink'}
            },
        },
        mine: {
            display(){return '雷'},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                edit({
                    type: 'item',
                    choose: 'mine',
                })
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'yellow'}
            },
        },
    },
    microtabs: {
        tab: {
            "main": {
                name(){return '主页'},
                nameI18N(){return 'main'},
                content: [
                    'grid',
                    'blank',
                    ['clickable', 'reset'],
                    'blank',
                    ['row', [['clickable', 'w']]],
                    ['row', [['clickable', 'a'], ['clickable', 's'], ['clickable', 'd']]],
                    'blank',
                    ['row', [['clickable', 'save'], 'blank', ['clickable', 'output'], 'blank', ['clickable', 'input']]],
                    'blank',
                    ['row', [['clickable', 'none'], ['clickable', 'clue'], ['clickable', 'mine']]],
                    ['row', [['clickable', 'arrow'], ['clickable', 'win']]],
                    'blank',
                    'blank',
                ],
            },
        },
    },
    tabFormat: [
       "blank",
       ["microtabs","tab"]
    ],
    layerShown(){return true},
})