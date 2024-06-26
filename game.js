export class Game{
        #settings={
            pointsToWin:10,
            gridSize:{
                x:4,
                y:4
            },
            googleJumpInterval:1000
        };
        #status='pending';
        #score={
            1:{points:0},
            2:{points:0}
        }
        #player1;
        #player2;
        #google;
        #clearIntervalForGoogle;

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
                this.#settings= {
                ...this.#settings,
                    ...settings
                }
                this.#settings.gridSize=settings.gridSize ? {...this.#settings.gridSize, ...settings.gridSize} : this.#settings.gridSize
    }
    get settings(){
        return this.#settings
    }

    get status(){
        return this.#status
    }

    get score(){
            return this.#score
    }
    async start(){
        if (this.#status==='pending'){
            this.#createPlayers();
            this.#createGoogle();
            this.#status='in-progress';
            this.#runGoogleJumpInterval()
        }
    }
    #runGoogleJumpInterval(){
        this.#clearIntervalForGoogle=setInterval(()=>{
            this.#moveGoogleForRandomPosition();
        }, this.#settings.googleJumpInterval)
    }
    async stop(){
            clearInterval(this.#clearIntervalForGoogle)
            this.#status='stopped'
    }

    async #finishGame() {
        clearInterval(this.#clearIntervalForGoogle);
        this.#status = 'finished'
    }
    #moveGoogleForRandomPosition(excludeGoogle=false){
            let noCrossedPositions=[
                this.#player1.position,
                this.#player2.position
            ];
            if (!excludeGoogle){
                noCrossedPositions.push(this.google.position)
            }

        this.#google.position=this.#getRandomPosition(noCrossedPositions)
    }
    get players(){
            return [this.#player1, this.#player2]
    }
    get google(){
        return this.#google
    }

    #createPlayers(){
        const player1Position = new Position(NumberUtil.getRandomNumber(0, this.#settings.gridSize.x - 1), NumberUtil.getRandomNumber(0, this.#settings.gridSize.y - 1));
        this.#player1 = new Player(player1Position,1);
        const player2Position=this.#getRandomPosition([player1Position])
        this.#player2 = new Player(player2Position,2)
    }
    #createGoogle(){
            this.#google=new Google(this.#getRandomPosition([this.#player1.position,this.#player2.position]))
    }

    #canMoveBorder(player, delta) {
        const newPosition = player.position.clone();
        if (delta.x) newPosition.x += delta.x;
        if (delta.y) newPosition.y += delta.y;
        if (newPosition.x < 0 || newPosition.x >= this.#settings.gridSize.x) return false;
        if (newPosition.y < 0 || newPosition.y >= this.#settings.gridSize.y) return false;

        return true;
    }
    #canMoveOtherPlayer(player, otherPlayer, delta){
        const newPosition = player.position.clone();
        if (delta.x) newPosition.x += delta.x;
        if (delta.y) newPosition.y += delta.y;
        return !otherPlayer.position.equal(newPosition);

    }

    #checkGoogleCatching(player) {
        if (player.position.equal(this.#google.position)) {
            this.#score[player.number].points++
            if (this.#score[player.number].points===this.#settings.pointsToWin){
                this.#finishGame()
            } else {
                clearInterval(this.#clearIntervalForGoogle);
                this.#moveGoogleForRandomPosition();
                this.#runGoogleJumpInterval()
            }

        }
    }
    #movePlayer(player, otherPlayer, delta){
            const canMove=this.#canMoveBorder(player, delta);
            if (!canMove) return;
            const canMoveOtherPlayer=this.#canMoveOtherPlayer(player, otherPlayer, delta);
        if (!canMoveOtherPlayer) return;
        if (delta.x) player.position.x+=delta.x;
        if (delta.y) player.position.y+=delta.y;
        this.#checkGoogleCatching(player);
    }
    movePlayer1Right(){
        let delta={x:1};
        this.#movePlayer(this.#player1, this.#player2,delta)
    }
    movePlayer1Left(){
        let delta={x:-1};
        this.#movePlayer(this.#player1, this.#player2,delta)
    }
    movePlayer2Right(){
        let delta={x:1};
        this.#movePlayer(this.#player2, this.#player1,delta)
    }
    movePlayer2Left(){
        let delta={x:-1};
        this.#movePlayer(this.#player2, this.#player1,delta)
    }
    movePlayer1Up(){
        let delta={y:-1};
        this.#movePlayer(this.#player1, this.#player2,delta)
    }
    movePlayer1Down(){
        let delta={y:1};
        this.#movePlayer(this.#player1, this.#player2,delta)
    }
    movePlayer2Up(){
        let delta={y:-1};
        this.#movePlayer(this.#player2, this.#player1,delta)
    }
    movePlayer2Down(){
        let delta={y:1};
        this.#movePlayer(this.#player2, this.#player1,delta)
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
    clone(){
        return new Position(this.x, this.y)
    }
    equal(otherPosition){
        return otherPosition.x===this.x && otherPosition.y===this.y
    }
}
class Unit{
    constructor(position) {
        this.position = position
    }
}
class Player extends Unit {
    constructor(position, number) {
        super(position)
        this.number=number
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