window.onkeydown = function(e) {
    if (e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
    }
}

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
        info: 'none',
    }},
    color: "yellow",
    type: "none",
    update(diff){
        let width = (window.innerWidth * 0.8) - 150
        let height = (window.innerHeight * 0.8) - 75
        width = width / Number(player.mine.levelCols)
        height = height / Number(player.mine.levelRows)
        let gird = Math.min(width, height)
        document.body.style.setProperty('--girdWidth', gird+'px')
        document.body.style.setProperty('--fontSize', gird-7+'px')
    },
    hotkeys: [
        {key: " ", description: "SPACE", onPress(){enterLevel()}},
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
            return startData()
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
                    if(player.mine.meta!=='none'){
                        player.mine.grid[id]['meta'] = player.mine.meta
                    }
                }
            }
        },
        getDisplay(data, id){
            if(data['item']=='arrow'){
                if(data['data']){
                    return '<img src="png/player.png" style="image-rendering: pixelated; width: var(--fontSize)"></img>'
                }else{
                    return '<span style="font-size: 30px">🧊</span>'
                }
            }
            if(data['item']=='box'){
                return '<span style="font-size: 30px">📦</span>'
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
                    return '<span style="color: black">F</span>'
                }
                return 'F'
            }
            let a = Number(id) % 10
            let b = Math.floor(Number(id) / 10) % 10
            let c = Math.floor(Number(id) / 100) % 10
            let d = Math.floor(Number(id) / 1000) % 10
            if(n(c).add(n(d).mul(10)).eq(1)){
                return '<span style="font-size: 30px">'+(a+b*10)+'<span>'
            }
            if(n(a).add(n(b).mul(10)).eq(1)){
                return '<span style="font-size: 30px">'+(c+d*10)+'<span>'
            }
            return ''
        },
        getStyle(data, id){
            let background = '#E5E5E5'
            let borderLeft = 'none'
            let borderRight = 'none'
            let borderTop = 'none'
            let borderBottom = 'none'
            let borderLeftColor = '#E5E5E5'
            let borderRightColor = '#E5E5E5'
            let borderTopColor = '#E5E5E5'
            let borderBottomColor = '#E5E5E5'
            if(data['wall']=='blank'){
                background = '#fff'
            }
            if(data['wall']=='none'){
                borderLeftColor = '#fff'
                borderRightColor = '#fff'
                borderTopColor = '#fff'
                borderBottomColor = '#fff'
                if(player.mine.grid[Number(id)-100]?.['wall']=='blank'){
                    borderTop = ''
                    borderTopColor = '#000'
                }
                if(player.mine.grid[Number(id)+100]?.['wall']=='blank'){
                    borderBottom = ''
                    borderBottomColor = '#000'
                }
                if(player.mine.grid[Number(id)-1]?.['wall']=='blank'){
                    borderLeft = ''
                    borderLeftColor = '#000'
                }
                if(player.mine.grid[Number(id)+1]?.['wall']=='blank'){
                    borderRight = ''
                    borderRightColor = '#000'
                }
            }
            if(data['wall']=='win'){
                borderTop = ''
                borderBottom = ''
                borderLeft = ''
                borderRight = ''
                borderLeftColor = '#000'
                borderRightColor = '#000'
                borderTopColor = '#000'
                borderBottomColor = '#000'
                background = 'yellow'
                if(getCanWin()){
                    borderLeftColor = '#fff'
                    borderRightColor = '#fff'
                    borderTopColor = '#fff'
                    borderBottomColor = '#fff'
                }
            }

            return {
                width: 'var(--girdWidth)',
                height: 'var(--girdWidth)',
                'font-size': 'var(--fontSize)',
                'border-radius': '0',
                background,
                'border-left': borderLeft,
                'border-right': borderRight,
                'border-top': borderTop,
                'border-bottom': borderBottom,
                'border-left-color': borderLeftColor,
                'border-right-color': borderRightColor,
                'border-top-color': borderTopColor,
                'border-bottom-color': borderBottomColor,
            }
        },
    },
    clickables: {
        interaction: {
            display(){return '交互'},
            canClick(){return true},
            onClick(){
                enterLevel()
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },
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
        undo: {
            display(){return '撤销'},
            canClick(){return true},
            onClick(){
                undo()
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
        box: {
            display(){
                return '箱子'
            },
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                edit({
                    type: 'item',
                    choose: 'box',
                })
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'pink'}
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
                    ["display-text", function() {return player.mine.lastWorld+'/'+player.mine.lastLevel}],
                    'blank',
                    'grid',
                    'blank',
                    ['row', [['clickable', 'undo'],['clickable', 'interaction']]],
                    'blank',
                    ['row', [['clickable', 'w']]],
                    ['row', [['clickable', 'a'], ['clickable', 's'], ['clickable', 'd']]],
                    'blank',
                    ['clickable', 'reset'],
                    'blank',
                    ['row', [['clickable', 'save'], 'blank', ['clickable', 'output'], 'blank', ['clickable', 'input']]],
                    'blank',
                    ['row', [['clickable', 'rowAdd'], ['clickable', 'rowSub']]],
                    ['row', [['clickable', 'colAdd'], ['clickable', 'colSub']]],
                    'blank',
                    ['row', [['clickable', 'none'], ['clickable', 'clue'], ['clickable', 'box'], ['clickable', 'mine']]],
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