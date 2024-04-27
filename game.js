class Game{
        #settings={
            gridSize:{
                x:4,
                y:4
            }
        };
        #status='pending';
        #player1;
        #player2;
        #google;

        constructor(){

        }

#getRandomPosition(noCrossedPosition=[]){
            let newX;
            let newY;
    do {
        newX = NumberUtil.getRandomNumber(0, this.#settings.gridSize.x-1)
        newY = NumberUtil.getRandomNumber(0, this.#settings.gridSize.y-1)
    } while (
        noCrossedPosition.some(p=>p.x===newX && p.y===newY)
        )
    return new Position(newX,newY)
}
    set settings(settings){
            if (!settings.gridSize){
                throw new Error('Incorrect size of grid');
            }
                this.#settings=settings
    }
    get settings(){
        return this.#settings
    }

    get status(){
        return this.#status
    }
    async start(){
        if (this.#status==='pending'){
            this.#createPlayers();
            this.#createGoogle()
            this.#status='in-progress'
        }
    }
    get players(){
            return [this.#player1, this.#player2]
    }
    get google(){
        return this.#google
    }

    #createPlayers(){
        const player1Position = new Position(NumberUtil.getRandomNumber(0, this.#settings.gridSize.x - 1), NumberUtil.getRandomNumber(0, this.#settings.gridSize.y - 1));
        this.#player1 = new Player(player1Position);
        const player2Position=this.#getRandomPosition([player1Position])
        this.#player2 = new Player(player2Position)
    }
    #createGoogle(){
            this.#google=new Google(this.#getRandomPosition([this.#player1.position,this.#player2.position]))
    }
}

class NumberUtil{
    static getRandomNumber(min,max){
        return (Math.floor(Math.random() * (max-min+1))+min)
    }
}

class Position{
    constructor(x,y){
        this.x=x;
        this.y=y
    }
}
class Unit{
    constructor(position) {
        this.position = position
    }
}
class Player extends Unit {
    constructor(position) {
        super(position)
    }
}
class Google extends Unit {
    constructor(position) {
        super(position)
    }
}


module.exports={
    Game
}