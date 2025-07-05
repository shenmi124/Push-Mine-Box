const createElement = {
    container: document.querySelector('.container'),
    width: 0,
    height: 0,
    col: 1,
    row: 1,
    positionX: 0,
    positionY: 0,
    init(){
        getPosition()
        this.resize()
        this.createElement()
        this.addAnimation()
        this.getLevel()
    },
    resize(){
        this.container = document.querySelector('.container')
        this.container.innerHTML = ''
        this.width = this.container.getBoundingClientRect().width
        this.height = this.container.getBoundingClientRect().height
        this.col = Number(player.data.colSize)
        this.row = Number(player.data.rowSize)
        this.positionX = 0
        this.positionY = 0
    },
    getRadius(){
        let width = this.width / this.col
        let height = this.height / this.row
        let grid = Math.min(width, height)
        return grid
    },
    getLevel(){
        let level = ':'
        for(let i in player.data.level){
            level += '\\'+World[player.data.level[i]].data.name
        }
        getByID('level', level)
    },
    addAnimation(){
        for(let i in AnimationItem){
            document.getElementById(AnimationItem[i][0]).classList.add(AnimationItem[i][1])
        }
        AnimationItem = []
    },
    createElement(){
        let r = this.getRadius()
        let extraX = (this.width - this.col * r) / 2
        let extraY = (this.height - this.row * r) / 2

        document.body.style.setProperty('--girdWidth', r+'px')
        document.body.style.setProperty('--HorizontalGirdWidth', '0px')
        document.body.style.setProperty('--VerticalGirdWidth', '0px')
        if(LastMove=='top'){
            document.body.style.setProperty('--VerticalGirdWidth', r+'px')
        }
        if(LastMove=='bottom'){
            document.body.style.setProperty('--VerticalGirdWidth', -r+'px')
        }
        if(LastMove=='left'){
            document.body.style.setProperty('--HorizontalGirdWidth', r+'px')
        }
        if(LastMove=='right'){
            document.body.style.setProperty('--HorizontalGirdWidth', -r+'px')
        }

        let adjustmentX = MinCol <= 0 ? -MinCol : 0
        let adjustmentY = MinRow <= 0 ? -MinRow : 0

        for(let col = 0; col<this.col; col++){
            for(let row = 0; row<this.row; row++){
                let element = player.data.grid['x'+Number(col-adjustmentX)+'y'+Number(row-adjustmentY)]?.wall?.type

                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
                rect.setAttribute('width', r)
                rect.setAttribute('height', r)
                rect.setAttribute('x', extraX + col * r)
                rect.setAttribute('y', extraY + row * r)
                if(components.wall[element]?.draw?.fill!==undefined){
                    rect.setAttribute('fill', components.wall[element]?.draw?.fill(col-adjustmentX, row-adjustmentY))
                }else{
                    rect.setAttribute('fill', 'lightgrey')
                }
                rect.setAttribute('stroke', 'black')
                rect.setAttribute('stroke-width', '2')
                rect.setAttribute('id', (element??'wall')+'x'+Number(col-adjustmentX)+'y'+Number(row-adjustmentY))
                this.container.appendChild(rect)

                let draw = components.wall[element]?.draw
                createTextElementNS(draw, element, r, [extraX, extraY], [adjustmentX, adjustmentY], [col-adjustmentX, row-adjustmentY])
            }
        }

        for(let i in components.item){
            createItemElementNS(components.item[i].draw, i, r, [extraX, extraY], [adjustmentX, adjustmentY])
        }

        for(let col = 0; col<this.col; col++){
            for(let row = 0; row<this.row; row++){
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
                rect.setAttribute('width', r)
                rect.setAttribute('height', r)
                rect.setAttribute('x', extraX + col * r)
                rect.setAttribute('y', extraY + row * r)
                rect.setAttribute('fill', '#fff0')
                rect.setAttribute('stroke', '')
                rect.setAttribute('stroke-width', '2')
                rect.setAttribute('onclick', `edit(`+Number(col-adjustmentX)+`,`+Number(row-adjustmentY)+`)`)
                this.container.appendChild(rect)
            }
        }

        /*for(let col = 0; col<this.col; col++){
            for(let row = 0; row<this.row; row++){
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
                text.innerHTML = 'X:'+(col-adjustmentX)+' Y:'+(row-adjustmentY)
                text.setAttribute('font-size', '20px')
                text.setAttribute('x', extraX + col * r)
                text.setAttribute('y', extraY + row * r + 20)
                this.container.appendChild(text)
            }
        }*/
    },
}

function createItemElementNS(draw, type, r, extra, adjustment){
    let drawPosition = draw.position()
    let elementShapes = draw.shapes()
    for(let i in drawPosition){
        let position = drawPosition[i]

        const element = document.createElementNS('http://www.w3.org/2000/svg', elementShapes)

        if(elementShapes=='circle'){ 
            element.setAttribute('r', r / 2)
            element.setAttribute('cx', extra[0] + (position[0] + adjustment[0]) * r + r / 2)
            element.setAttribute('cy', extra[1] + (position[1] + adjustment[1]) * r + r / 2)
        }else if(elementShapes=='rect'){
            element.setAttribute('width', r)
            element.setAttribute('height', r)
            element.setAttribute('x', extra[0] + (position[0] + adjustment[0]) * r)
            element.setAttribute('y', extra[1] + (position[1] + adjustment[1]) * r)
        }

        element.setAttribute('fill', draw.fill(position[0], position[1]))
        element.setAttribute('stroke', '#000')
        element.setAttribute('stroke-width', '2')
        element.setAttribute('id', type+'x'+position[0]+'y'+position[1])
        document.querySelector('.container').appendChild(element)
        
        createTextElementNS(draw, type, r, extra, adjustment, position)
    }
}

function createTextElementNS(draw, type, r, extra, adjustment, position){        
    if(draw?.text!==undefined){
        let size = 1.5
        if(draw.textSize!==undefined){
            size = draw.textSize(position[0], position[1])
        }

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        text.innerHTML = draw.text(position[0], position[1])
        text.setAttribute('font-size', r / size)
        text.setAttribute('x', extra[0] + (position[0] + adjustment[0]) * r + r / 2)
        text.setAttribute('y', extra[1] + (position[1] + adjustment[1]) * r + r / 2)
        text.setAttribute('fill', draw?.textColor?.(position[0], position[1]))
        text.setAttribute('class', 'clueText')
        text.setAttribute('id', 'text'+type+'x'+position[0]+'y'+position[1])
        document.querySelector('.container').appendChild(text)
    }
}

/*const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
text.innerHTML = ''
text.setAttribute('font-size', r / 2)
text.setAttribute('x', x)
text.setAttribute('y', y)
this.container.appendChild(text)*/