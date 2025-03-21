addLayer("mine", {
    name: "扫雷",
    symbol: "扫雷",
    symbolI18N: "扫雷",
    position: 0,
    row: 0,
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
        {key: "w", description: "W", onPress(){timePast('w')}},
        {key: "a", description: "A", onPress(){timePast('a')}},
        {key: "s", description: "S", onPress(){timePast('s')}},
        {key: "d", description: "D", onPress(){timePast('d')}},
        {key: "r", description: "R", onPress(){inputLevel(player.mine.lastWorld, player.mine.lastLevel)}},
        {key: "z", description: "Z", onPress(){undo()}},
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
            onClick(){timePast('w')},
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },
        a: {
            display(){return 'A'},
            canClick(){return true},
            onClick(){timePast('a')},
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },
        s: {
            display(){return 'S'},
            canClick(){return true},
            onClick(){timePast('s')},
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },
        d: {
            display(){return 'D'},
            canClick(){return true},
            onClick(){timePast('d')},
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