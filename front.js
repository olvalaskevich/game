import {Game} from "./game.js";


const game=new Game();

const tableElement=document.getElementById('game-grid')

for (let y=0; y<game.settings.gridSize.y; y++){
    const trElement=document.createElement('tr');
    for (let x=0; y<game.settings.gridSize.x; x++){
        const tdElement=document.createElement('td')
        trElement.append(tdElement);
    }
    tableElement.append(trElement);
}