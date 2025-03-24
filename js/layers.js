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

        levelRows: n(18),
        levelCols: n(33),

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
        rows: 18,
        cols: 33,
        getUnlocked(id){
            let a = Number(id) % 10
            let b = Math.floor(Number(id) / 10) % 10
            let c = Math.floor(Number(id) / 100) % 10
            let d = Math.floor(Number(id) / 1000) % 10
            if(player.mine.levelRows.gte(n(c).add(n(d).mul(10))) && player.mine.levelCols.gte(n(a).add(n(b).mul(10)))){
                return true
            }
            return false
        },
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
                    return '<span style="color: green">'+format(data['data'], 0)+'</span>'
                }
                if(data['wall']=='blank'){
                    return '<span style="color: dark">'+format(data['data'], 0)+'</span>'
                }
                return format(data['data'], 0)
            }
            if(data['item']=='mine'){
                if(data['wall']=='blank'){
                    return '<span style="color: green">F</span>'
                }
                return 'F'
            }
            let a = Number(id) % 10
            let b = Math.floor(Number(id) / 10) % 10
            let c = Math.floor(Number(id) / 100) % 10
            let d = Math.floor(Number(id) / 1000) % 10
            if(n(c).add(n(d).mul(10)).eq(1)){
                return '<small><sup>'+(a+b*10)+'</sup><small>'
            }
            if(n(a).add(n(b).mul(10)).eq(1)){
                return '<small><sup>'+(c+d*10)+'</sup><small>'
            }
            return ''
        },
        getStyle(data, id){
            let background = '#E5E5E5'
            let borderColor = '#E5E5E5'
            if(data['wall']=='blank'){
                background = '#fff'
                borderColor = '#fff'
            }
            if(data['wall']=='win'){
                borderColor = 'black'
                background = '#fff'
                if(getCanWin()){
                    borderColor = '#fff'
                    background = 'green'
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

        rowAdd: {
            display(){return '行增加'},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                player.mine.levelRows = player.mine.levelRows.add(1).min(18)
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'white'}
            },
        },
        rowSub: {
            display(){return '行减少'},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                player.mine.levelRows = player.mine.levelRows.sub(1).max(1)
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'white'}
            },
        },

        colAdd: {
            display(){return '列增加'},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                player.mine.levelCols = player.mine.levelCols.add(1).min(33)
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'white'}
            },
        },
        colSub: {
            display(){return '列减少'},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                player.mine.levelCols = player.mine.levelCols.sub(1).max(1)
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'white'}
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
                    ['row', [['clickable', 'rowAdd'], ['clickable', 'rowSub']]],
                    ['row', [['clickable', 'colAdd'], ['clickable', 'colSub']]],
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