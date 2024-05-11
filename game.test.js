const {Game} = require("./game");

describe('tests for game', ()=>{
    it('settings test', ()=>{
        const game=new Game()
        game.settings={
            gridSize:{
                x:4,
                y:4
            }
        }
        const setting=game.settings

        expect(setting.gridSize.x).toBe(4)
        expect(setting.gridSize.y).toBe(4)
    })
    it('start game test', async ()=>{
        const game=new Game()
        game.settings={
            gridSize:{
                x:4,
                y:4
            }
        }


        expect(game.status).toBe('pending')

        await game.start()

        expect(game.status).toBe('in-progress')
    })

    it('check player init position', async ()=>{
        for (i=0; i<10; i++){
            const game=new Game()
            game.settings={
                gridSize:{
                    x:1,
                    y:3
                }
            }
            await game.start();
            expect([0]).toContain(game.players[0].position.x)
            expect([0,1,2]).toContain(game.players[0].position.y)

            expect([0]).toContain(game.players[1].position.x)
            expect([0,1,2]).toContain(game.players[1].position.y)

            expect(game.players[0].position.x!==game.players[1].position.x ||
            game.players[0].position.y!==game.players[1].position.y).toBe(true)
        }

    })
    it('check google init position', async ()=>{
        for (i=0; i<10; i++){
            const game=new Game()
            game.settings={
                gridSize:{
                    x:1,
                    y:3
                }
            }
            await game.start();
            expect([0]).toContain(game.google.position.x)
            expect([0,1,2]).toContain(game.google.position.y)

            expect((game.google.position.x!==game.players[0].position.x || game.google.position.y!==game.players[0].position.y) &&
                (game.google.position.x!==game.players[1].position.x || game.google.position.y!==game.players[1].position.y)).toBe(true)
        }

    })
    it('check google position after jump', async ()=>{

            const game=new Game()
            game.settings={
                gridSize:{
                    x:1,
                    y:4
                },
                googleJumpInterval:1000

            }
            await game.start();

            let prevGooglePosition=game.google.position.clone()

            await sleep(1500)

            expect(game.google.position.equal(prevGooglePosition)).toBe(false)




    })
    it('catch google by player', async ()=>{

        const game=new Game()
        game.settings={
            gridSize:{
                x:3,
                y:1
            }

        }
        await game.start();
        let prevGooglePosition=game.google.position.clone()
        const deltaForPlayer1 = game.google.position.x-game.players[0].position.x
        if (Math.abs(deltaForPlayer1)===2){
        const deltaForPlayer2=game.google.position.x-game.players[1].position.x
            if(deltaForPlayer2>0){
                game.movePlayer2Right()
            } else {
                game.movePlayer2Left()
            }
            expect(game.score[2].points).toBe(1)
            expect(game.score[1].points).toBe(0)

        } else {
            if(deltaForPlayer1>0){
                game.movePlayer1Right()
            } else {
                game.movePlayer1Left()
            }
            expect(game.score[1].points).toBe(1)
            expect(game.score[2].points).toBe(0)
        }
        expect(game.google.position.equal(prevGooglePosition)).toBe(false)


    })
})

async function sleep(t){
    return new Promise((res)=>setTimeout(res,t))
}