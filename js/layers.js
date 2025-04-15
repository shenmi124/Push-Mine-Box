window.onkeydown = function(e) {
    if (e.keyCode===32 && e.target===document.body) {
        e.preventDefault();
    }

    if(e.keyCode===192){
        player.mine.console = !player.mine.console
    }

    if(player.mine.console){
        if(e.keyCode>=48 && e.keyCode<=56){
            edit({
                type: 'item',
                choose: 'clue',
                data: n(e.keyCode-48).floor()
            })
        }
        if(e.keyCode===66){
            edit({
                type: 'item',
                choose: 'box',
            })
        }
        if(e.keyCode===86){
            edit({
                type: 'wall',
                choose: 'blank',
            })
        }
        if(e.keyCode===70){
            edit({
                type: 'item',
                choose: 'mine',
            })
        }
    }
}

let PEuser = true

addLayer("mine", {
    name: "扫雷",
    symbol: "扫雷",
    symbolI18N: "扫雷",
    position: 0,
    row: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),

        initialization: false,

        completeLevel: [],

        lastWorld: 'world0',
        lastLevel: 'world',

        lastEnterWorld: 'world0',
        lastEnterLevel: 'world',

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
        if(player.tab!=='mine' && !player.mine.console){
            showTab('mine')
            inputLevel(player.mine.lastWorld, player.mine.lastLevel)
        }

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
        {key: "q", description: "Q", onPress(){quitLevel()}},
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
                    player.mine.grid[id]['data'] = 'none'
                    player.mine.grid[id]['meta'] = 'none'
                    player.mine.grid[id]['info'] = 'none'
                }else{
                    player.mine.grid[id][player.mine.type] = player.mine.choose
                    if(player.mine.data!=='none'){
                        player.mine.grid[id]['data'] = player.mine.data
                    }
                    if(player.mine.meta!=='none'){
                        player.mine.grid[id]['meta'] = player.mine.meta
                    }
                    if(player.mine.info!=='none'){
                        player.mine.grid[id]['info'] = player.mine.info
                    }
                }
            }
        },
        getDisplay(data, id){
            let text = ''

            if(data['item']=='arrow'){
                if(data['data']){
                    text = '<img src="png/player.png" style="image-rendering: pixelated; width: var(--fontSize)"></img>'
                }else{
                    text = '<span style="font-size: 30px">🧊</span>'
                }
            }
            if(data['item']=='box'){
                text = '<span style="font-size: 30px">📦</span>'
            }
            if(data['item']=='clue'){
                text = format(data['data'], 0)
                if(data['wall']=='blank'){
                    text = '<span style="color: dark">'+format(data['data'], 0)+'</span>'
                }
                if(getRightClue(id)=='more'){
                    text = '<span style="color: red">'+format(data['data'], 0)+'</span>'
                }else if(getRightClue(id)){
                    text = '<span style="color: green">'+format(data['data'], 0)+'</span>'
                }
            }
            if(data['item']=='mine'){
                if(data['wall']=='blank'){
                    text = '<span style="color: black">F</span>'
                }
                text = '<span style="color: black">F</span>'
                //text = '<img src="png/flag.png" style="image-rendering: pixelated; width: var(--girdWidth)"></img>'
            }

            if(data['info']!=='none'){
                text += '<span style="position: absolute; font-size: 20px; top: 0px; left: 5px">'+data['info']+'</span>'
            }

            if(player.mine.console){
                let a = Number(id) % 10
                let b = Math.floor(Number(id) / 10) % 10
                let c = Math.floor(Number(id) / 100) % 10
                let d = Math.floor(Number(id) / 1000) % 10
                if(n(c).add(n(d).mul(10)).eq(1)){
                    text += '<span style="font-size: 30px">'+(a+b*10)+'<span>'
                }
                if(n(a).add(n(b).mul(10)).eq(1)){
                    text += '<span style="font-size: 30px">'+(c+d*10)+'<span>'
                }
            }

            return '<span style="display: flex; justify-content: space-around">'+text+'</span>'
        },
        getStyle(data, id){
            let color = '#000'
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

                let type = ['blank', 'win', 'enter']
                for(let i in type){
                    if(player.mine.grid[Number(id)-100]?.['wall']==type[i]){
                        borderTop = ''
                        borderTopColor = '#000'
                    }
                    if(player.mine.grid[Number(id)+100]?.['wall']==type[i]){
                        borderBottom = ''
                        borderBottomColor = '#000'
                    }
                    if(player.mine.grid[Number(id)-1]?.['wall']==type[i]){
                        borderLeft = ''
                        borderLeftColor = '#000'
                    }
                    if(player.mine.grid[Number(id)+1]?.['wall']==type[i]){
                        borderRight = ''
                        borderRightColor = '#000'
                    }
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
            if(data['wall']=='enter'){
                borderTop = ''
                borderBottom = ''
                borderLeft = ''
                borderRight = ''
                borderLeftColor = '#fff'
                borderRightColor = '#fff'
                borderTopColor = '#fff'
                borderBottomColor = '#fff'
                background = 'lightgreen'
                if(getComplete(data['meta'])){
                    color = 'green'
                    borderLeftColor = 'green'
                    borderRightColor = 'green'
                    borderTopColor = 'green'
                    borderBottomColor = 'green'
                }else if(data['item']=='arrow'){
                    borderLeftColor = '#000'
                    borderRightColor = '#000'
                    borderTopColor = '#000'
                    borderBottomColor = '#000'
                }
            }

            return {
                color,
                width: 'var(--girdWidth)',
                height: 'var(--girdWidth)',
                'font-size': 'var(--fontSize)',
                'border-radius': '0',
                background,
                'padding': 0,
                'border-left': borderLeft,
                'border-right': borderRight,
                'border-top': borderTop,
                'border-bottom': borderBottom,
                'border-left-color': borderLeftColor,
                'border-right-color': borderRightColor,
                'border-top-color': borderTopColor,
                'border-bottom-color': borderBottomColor,
                /*'border-left-width': '1px',
                'border-right-width': '1px',
                'border-top-width': '1px',
                'border-bottom-width': '1px',*/
            }
        },
    },
    clickables: {
        interaction: {
            display(){return '交互'},
            canClick(){return true},
            unlocked(){return PEuser},
            onClick(){
                enterLevel()
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },
        quit: {
            display(){return '退出'},
            canClick(){return true},
            unlocked(){return PEuser},
            onClick(){
                quitLevel()
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },
        reset: {
            display(){return '重置'},
            canClick(){return true},
            unlocked(){return PEuser},
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
            unlocked(){return PEuser},
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
            unlocked(){return PEuser},
            onClick(){timePast('w')},
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },
        a: {
            display(){return 'A'},
            canClick(){return true},
            unlocked(){return PEuser},
            onClick(){timePast('a')},
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },
        s: {
            display(){return 'S'},
            canClick(){return true},
            unlocked(){return PEuser},
            onClick(){timePast('s')},
            style(){
                return {'width': '75px', 'height': '75px', 'background': '#fff'}
            },
        },
        d: {
            display(){return 'D'},
            canClick(){return true},
            unlocked(){return PEuser},
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

        rowMoveAdd: {
            display(){return '左平移'},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                for(let ic = 1; ic<=Number(player.mine.levelCols); ic++){
                    for(let ir = 1; ir<=Number(player.mine.levelRows); ir++){
                        let data = ir*100+ic
                        if(ic>=2){
                            player.mine.grid[data-1] = player.mine.grid[data]
                        }
                        if(ic==Number(player.mine.levelCols)){
                            player.mine.grid[data] = startData()
                        }
                    }
                }
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'white'}
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
        rowMoveSub: {
            display(){return '右平移'},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                for(let ic = 1; ic<=Number(player.mine.levelCols)-1; ic++){
                    for(let ir = 1; ir<=Number(player.mine.levelRows); ir++){
                        let data = ir*100+Number(player.mine.levelCols)-ic
                        player.mine.grid[data+1] = player.mine.grid[data]
                        if(ic==Number(player.mine.levelCols)-1){
                            player.mine.grid[data] = startData()
                        }
                    }
                }
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'white'}
            },
        },

        colMoveAdd: {
            display(){return '上平移'},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                for(let ir = 1; ir<=Number(player.mine.levelRows); ir++){
                    for(let ic = 1; ic<=Number(player.mine.levelCols); ic++){
                        let data = ir*100+ic
                        if(ir>=2){
                            player.mine.grid[data-100] = player.mine.grid[data]
                        }
                        if(ir==Number(player.mine.levelRows)){
                            player.mine.grid[data] = startData()
                        }
                    }
                }
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
        colMoveSub: {
            display(){return '下平移'},
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                for(let ir = 1; ir<=Number(player.mine.levelRows)-1; ir++){
                    for(let ic = 1; ic<=Number(player.mine.levelCols); ic++){
                        let data = ic+Number(player.mine.levelRows)*100-ir*100
                        player.mine.grid[data+100] = player.mine.grid[data]
                        if(ir==Number(player.mine.levelRows)-1){
                            player.mine.grid[data] = startData()
                        }
                    }
                }
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
                    info: prompt('输入信息'),
                })
            },
            style(){
                return {'width': '75px', 'height': '75px', 'background': 'white'}
            },
        },
        enter: {
            display(){
                if(player.mine.choose=='enter'){
                    return '进入<br>'+player.mine.meta
                }
                return '进入'
            },
            canClick(){return true},
            unlocked(){return player.mine.console},
            onClick(){
                edit({
                    type: 'wall',
                    choose: 'enter',
                    meta: [prompt('输入世界名'), prompt('输入关卡名')],
                    info: prompt('输入信息'),
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
                    ['clickable', 'quit'],
                    'blank',
                    ['row', [['clickable', 'save'], 'blank', ['clickable', 'output'], 'blank', ['clickable', 'input']]],
                    'blank',
                    ['row', [['clickable', 'rowMoveAdd'], ['clickable', 'colAdd'], ['clickable', 'colSub'], ['clickable', 'rowMoveSub']]],
                    ['row', [['clickable', 'colMoveAdd'], ['clickable', 'rowAdd'], ['clickable', 'rowSub'], ['clickable', 'colMoveSub']]],
                    'blank',
                    ['row', [['clickable', 'none'], ['clickable', 'clue'], ['clickable', 'box'], ['clickable', 'mine']]],
                    ['row', [['clickable', 'arrow'], ['clickable', 'win'], ['clickable', 'enter']]],
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