class Tank {
    positionX = 0;
    positionY = 0;

    // element = null
    // stage = null

    // constructor(stage) {
    //     this.stage = stage
    // }

    getView(url){
        const img = document.createElement('img')
        img.src = url
        
        const div = document.createElement('div')
        div.appendChild(img)
        div.style.position = 'absolute'

        this.element = div
        return this.element
    }

    // moveTo(x, y){
    //     this.element.style.left = x
    //     this.element.style.bottom = y
    // }

}

class Player extends Tank {
}

class Enemy extends Tank {
}

class Game {

    //Three levels by default
    BASIC = 0
    MEDIUM = 1
    HARD = 2

    //Default level if the user doesn't select anything
    level = null

    // Interval value to clear it in the future if needed
    renderInterval = 0

    player = null

    config = {
        enemies: {
            levels: {
                BASIC: 1,
                MEDIUM: 4,
                HARD: 10,
            }
        }
    }

    constructor(){
        //Initialize variables
        this.level = this.BASIC

        this.start()
    }

    getGameStage(){
        return document.getElementById("stage")
    }

    start() {
        //add a player
        this.addPlayer()
        //add n enemies
        this.addEnemies()

        this.renderInterval = setInterval(this.render, 50)
    }

    /*Always running function to execute continous actions in the game,         
      like moving*/
    render() {
       console.log('render')
    }

    addPlayer() {
        console.log('addPlayer')
        this.player = new Player()
        this.getGameStage().appendChild(this.player.getView(''))
        // this.player.addToStage()
        // this.addElementToGameStage(this.player.getView())
    }

    addEnemies() {
        console.log('addEnemies')
        this.enemy = new Enemy()
        this.getGameStage().appendChild(this.enemy.getView(''))
        // this.enemy.addToStage()
        // this.addElementToGameStage(this.enemy.getView())
        
    }

}



const newGame = new Game()