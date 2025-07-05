function getTextInput(){
    return document.activeElement.classList[0]!=='textinput'
}

window.onkeydown = function(e){
    function loadConsloe(){
        getByID('console', 
            player.data.console+
            '<br><br>MOD: '+editMod+
            '<br>DATA: '+editData+
            '<br>TYPE: '+editType+
            '<br>CODE: '+editCode
        )
    }
    if (e.keyCode===32){
        e.preventDefault();
    }

    if(getTextInput()){
        if(e.keyCode===192){
            player.data.console = !player.data.console
            loadConsloe()
        }

        if(e.keyCode===69){
        }

        if(e.keyCode===82){
            /*addElements(new Elements(0, 0).setData('item').setType('player').setArrow())
            for(let col = -1; col<=1; col++){
                for(let row = -1; row<=1; row++){
                    addElements(new Elements(col, row).setData('wall').setType('blank'))
                }
            }
            addElements(new Elements(1, 1).setData('item').setType('box'))
            addElements(new Elements(-1, 1).setData('item').setType('clue').setCode(1))
            addElements(new Elements(1, -1).setData('item').setType('clue').setCode(2))
            addElements(new Elements(-1, -1).setData('item').setType('flag'))
            addElements(new Elements(1, 0).setData('wall').setType('enter').setCode('world'))
            addElements(new Elements(-1, 0).setData('wall').setType('finish').setCode('world'))
            player.data.level = ['world']
            createElement.init()*/
            resetLevel()
        }

        if(e.keyCode===87){
            LastMove = 'top'
            timepast()
        }

        if(e.keyCode===83){
            LastMove = 'bottom'
            timepast()
        }

        if(e.keyCode===65){
            LastMove = 'left'
            timepast()
        }

        if(e.keyCode===68){
            LastMove = 'right'
            timepast()
        }

        if(e.keyCode===32){
            LastMove = 'space'
            timepast()
        }

        if(e.keyCode===81){
            quitLevel()
            createElement.init()
        }

        if(e.keyCode===90){
            if(Undo[Undo.length-1]!==undefined){
                inputLevel(JSON.parse(Undo[Undo.length-1]))
                Undo.pop()
                createElement.init()
            }
        }

        if(player.data.console){
            if(e.keyCode===86){
                editMod = 'blank'
                editData = ''
                editType = ''
                editCode = ''
                loadConsloe()
            }
            if(e.keyCode===80){
                editMod = 'item'
                editData = 'item'
                editType = 'player'
                editCode = ''
                loadConsloe()
            }
            if(e.keyCode===66){
                editMod = 'item'
                editData = 'item'
                editType = 'box'
                editCode = ''
                loadConsloe()
            }
            if(e.keyCode>=48 && e.keyCode<=56){
                editMod = 'item'
                editData = 'item'
                editType = 'clue'
                editCode = e.keyCode-48
                loadConsloe()
            }
            if(e.keyCode===70){
                editMod = 'item'
                editData = 'item'
                editType = 'flag'
                editCode = ''
                loadConsloe()
            }
            if(e.keyCode===71){
                editMod = 'wall'
                editData = 'wall'
                editType = 'finish'
                editCode = ''
                loadConsloe()
            }
            if(e.keyCode===72){
                editMod = 'wall'
                editData = 'wall'
                editType = 'enter'
                editCode = prompt('进入关卡')
                loadConsloe()
            }
            if(e.keyCode===73){
                editMod = 'wall'
                editData = 'wall'
                editType = 'information'
                editCode = prompt('信息')
                loadConsloe()
            }
        }
    }
}
