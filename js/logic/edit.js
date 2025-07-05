function addElements(value){
    let x = value.getPositonX()
    let y = value.getPositonY()

    player.data.grid['x'+x+'y'+y] ??= {}

    player.data.grid['x'+x+'y'+y][value.getData()] = value
}

let editMod = 'blank'
let editData = ''
let editType = ''
let editCode = ''
function edit(positionX, positionY){
    if(player.data.console){
        player.data.grid['x'+positionX+'y'+positionY] ??= {}
    
        if(editMod=='blank'){
            player.data.grid['x'+positionX+'y'+positionY].wall ??= new Elements(positionX, positionY).setData('wall').setType('wall')
            let editElement = player.data.grid['x'+positionX+'y'+positionY].wall
            if(editElement.getType()!=='blank'){
                delete player.data.grid['x'+positionX+'y'+positionY].wall
                addElements(editElement.setType('blank'))
            }else{
                delete player.data.grid['x'+positionX+'y'+positionY].wall
            }
        }else if(editMod=='item'){
            let editElement = player.data.grid['x'+positionX+'y'+positionY].item
            if(editElement!==undefined){
                delete player.data.grid['x'+positionX+'y'+positionY].item
            }else{
                addElements(new Elements(positionX, positionY).setData(editData).setType(editType).setCode(editCode).setArrow(editType=='player'))
            }
        }else if(editMod=='wall'){
            let editElement = player.data.grid['x'+positionX+'y'+positionY].wall
            if(editElement!==undefined && editElement?.type!=='blank'){
                delete player.data.grid['x'+positionX+'y'+positionY].wall
            }else{
                delete player.data.grid['x'+positionX+'y'+positionY].wall
                addElements(new Elements(positionX, positionY).setData(editData).setType(editType).setCode(editCode))
            }
        }
    
        createElement.init()
    }
}

var Elements = function(x=0, y=0){
    this.position = [x, y]
    this.data = ''
    this.type = ''

    this.code = ''

    this.arrow = false

    Elements.prototype.getPositon = function(){
        return this.position
    }
    Elements.prototype.getPositonX = function(){
        return this.position[0]
    }
    Elements.prototype.getPositonY = function(){
        return this.position[1]
    }
    Elements.prototype.getData = function(){
        return this.data
    }
    Elements.prototype.getType = function(){
        return this.type
    }
    Elements.prototype.getCode = function(){
        return this.code
    }
    Elements.prototype.getArrow = function(){
        return this.arrow
    }

    Elements.prototype.setPositon = function([value]){
        this.setPositonX(value[0])
        this.setPositonY(value[1])
        return this
    }
    Elements.prototype.setPositonX = function(value){
        this.position[0] = value
        return this
    }
    Elements.prototype.setPositonY = function(value){
        this.position[1] = value
        return this
    }
    Elements.prototype.addPositonX = function(value){
        this.position[0] += value
        return this
    }
    Elements.prototype.addPositonY = function(value){
        this.position[1] += value
        return this
    }
    Elements.prototype.setData = function(value){
        this.data = value
        return this
    }
    Elements.prototype.setType = function(value){
        this.type = value
        return this
    }
    Elements.prototype.setCode = function(value){
        this.code = value
        return this
    }
    Elements.prototype.setArrow = function(value=true){
        this.arrow = value
        return this
    }
    Elements.prototype.setNotArrow = function(){
        this.arrow = !this.arrow
        return this
    }
}