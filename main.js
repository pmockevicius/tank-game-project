class GameItem {
    positionX = 0;
    positionY = 0;

    width = 7;
    height = 10;

    element = null

    //
    getHtmlElement(url) {
        const tankContainer = document.createElement('div')
        tankContainer.style.position = 'absolute'
        // tankContainer.style.backgroundColor = '#000'
        tankContainer.style.width = this.width + 'vw'
        tankContainer.style.height = this.height + 'vh'
        tankContainer.style.backgroundImage = `url(${url})`
        tankContainer.style.backgroundSize = `contain`
        tankContainer.style.backgroundRepeat = `no-repeat`
        tankContainer.style.backgroundPosition = `center`
        tankContainer.style.bottom = this.positionY + 'vh'
        tankContainer.style.left = this.positionX + 'vw'
        

        this.element = tankContainer
        return this.element
    }
}

class Player extends GameItem {

    constructor() {
        super()
        this.positionY = 0
        this.positionX = 50 - this.width / 2
 
    }
       

    moveLeft() {
        if (this.positionX > 0) {
            this.positionX -= 1;
            this.element.style.left = this.positionX + "vw";
            this.rotate = -90
            this.element.style.rotate = this.rotate + "deg";
        }

    }
    moveRight() {
        if (this.positionX < 100 - this.width) {
            this.positionX += 1;
            this.element.style.left = this.positionX + "vw";
            this.rotate = 90
            this.element.style.rotate = this.rotate + "deg";
        }
    }

    moveUp() {
        if (this.positionY <= 95 - this.height) {
            this.positionY += 1;
            this.element.style.bottom = this.positionY + "vh";
            this.rotate = 0
            this.element.style.rotate = this.rotate + "deg";
        }
    }

    moveDown() {
        if (this.positionY >= 1) {
            this.positionY -= 1;
            this.element.style.bottom = this.positionY + "vh";
            this.rotate = 180
            this.element.style.rotate = this.rotate + "deg";
        }
    }

    detectCollision(enemy) {
        if (
            this.positionX < enemy.positionX + enemy.width &&
            this.positionX + this.width > enemy.positionX &&
            this.positionY < enemy.positionY + enemy.height &&
            this.height + this.positionY > enemy.positionY
        ) {
            return true
        } else { return false }
    }

    getNodeElement() {
        return this.getHtmlElement('/images/player-tank.jpg')
    }
}

class Enemy extends GameItem {
    counter = 0
    timeWindow = 0
    changeDirectionAfter = 2000
    timesEllapsed = 0

    xValue = 0
    yValue = 0
    rotation = 0

    // enemy is overwriting tank constructor to set enemy starting position
    constructor() {
        super()
        this.positionY = 90
        this.positionX = parseInt(Math.random() * 95)

    }

    changeDirection() {
        const randomDirection = [1, -1].sort(() => Math.random() - 0.5)
        const randomNumber = Math.random() // 0 - 1
        if (randomNumber <= 0.5) {
            this.xValue = randomDirection[0]
            this.yValue = 0
            this.rotation = (this.xValue + 2) * 90 // tricky thing
        } else {
            this.xValue = 0
            this.yValue = randomDirection[0]
            this.rotation = (this.yValue + 1) * 90 // tricky thing
        }
    }

    setTimeWindow(time) {
        this.timeWindow = time
        this.timesEllapsed = this.changeDirectionAfter / this.timeWindow
    }

    manageCounter() {
        if (this.counter <= this.timesEllapsed) {
            this.counter += 1
        } else {
            this.changeDirection()
            this.resetCounter()
        }

    }
    resetCounter() {
        this.counter = 0
    }

    move() {
        this.detectCollision()
        this.manageCounter()
        this.positionX -= this.xValue
        this.positionY -= this.yValue
        this.element.style.bottom = `${this.positionY}vh`
        this.element.style.left = `${this.positionX}vw`
        this.element.style.rotate = `${this.rotation}deg`

    }

    detectCollision() {
        if (this.positionX > 95 || this.positionX < 5) {
            this.xValue *= -1
            this.yValue *= -1
            this.rotation = 90 * this.xValue * -1
        } else if (this.positionY > 95 || this.positionY < 5) {
            this.xValue *= -1
            this.yValue *= -1
            this.rotation = this.yValue == 1 ? 180 : 0
        }
    }

    getNodeElement() {
        return this.getHtmlElement('/images/enemy.png')
    }
}

class Bullet extends GameItem{

    constructor(x,y) {
        super()
        this.positionY =  x + 10
        this.positionX =  y 
    }

    // this.element.style.height = 4


    getNodeElement() {
        return this.getHtmlElement('/images/bullet_up.png')
    }


}

class Game {

    //Three levels by default
    BASIC = 'BASIC'
    MEDIUM = 'MEDIUM'
    HARD = 'HARD'

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
            },
            timeWindow: {
                BASIC: 16,
                MEDIUM: 10,
                HARD: 5,
            }
        }
    }

    enemies = []

    bullets = []

    timeWindow = 100

    stage = null

    constructor(stage) {
        //Initialize variables
        this.stage = stage
    }

    start(level) {
        this.level = level
        //add a player
        this.addPlayer()
        //add n enemies
        this.addEnemies(this.config.enemies.levels[this.level])
        //Initialize keyboard event listeners
        this.attachEventListeners()

        this.renderInterval = setInterval(() => {
            this.render()
        }, this.timeWindow)
    }

    end() {
        clearInterval(this.renderInterval)
        //TODO: Add show game over screen method

    }

    /*Always running function to execute continous actions in the game,         
      like moving*/
    render() {
        //    console.log('render', this)
        for (let index = 0; index < this.enemies.length; index++) {
            const element = this.enemies[index];
            element.move()
            const isColliding = this.player.detectCollision(element)
            console.log(isColliding)
            //TODO: Call game over
        }

    }

    addPlayer() {
        // console.log('addPlayer')
        this.player = new Player()

        this.stage.appendChild(this.player.getNodeElement())
        

    }

    addEnemies(quantity) {
        for (let index = 0; index < quantity; index++) {
            this.enemy = new Enemy()
            this.enemy.setTimeWindow(this.timeWindow)
            this.enemies.push(this.enemy)

            this.stage.appendChild(this.enemy.getNodeElement())
        }
    }

    addBullet(x,y){
        this.bullet = new Bullet(x,y)

        this.stage.appendChild(this.bullet.getNodeElement())
    }

    attachEventListeners() {
        // ***Disabling default browser scrolling with up/down/left/right space buttons***
        window.addEventListener("keydown", function (e) {
            if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }
        }, false);

        document.addEventListener("keydown", (e) => {

            console.log(e.key)
            if (e.key === "ArrowLeft") {
                this.player.moveLeft();
            } else if (e.key === "ArrowRight") {
                this.player.moveRight();
                console.log("right pressed ")
            }
            else if (e.key === "ArrowUp") {
                this.player.moveUp();
            } 
            else if (e.key === "ArrowDown") {
                this.player.moveDown();
            } 
            else if (e.key === " "){
                console.log(this.player.positionY)
                this.addBullet(this.player.positionY,this.player.positionX)
                //  

            }

        });
    }

}

// Cerating a stage for the game and passing it to the new Game instance

const stage = document.getElementById("stage")
const newGame = new Game(stage)
newGame.start(newGame.BASIC)

