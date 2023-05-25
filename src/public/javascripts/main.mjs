//import { io } from '/socket.io/socket.io.esm.min.js';

import * as cards from './cards.mjs';
import * as create from './renderfunction.mjs'


//generate a deck and shuffle it
let deck = cards.shuffle(cards.generateDeck()); 

let computerHand = []; 
let playerHand = []; 

const root = document.body.getElementsByClassName("game")[0]; 

let finished = false; 

//handle click event 
function handleClick(evt){
    //must also get rid of what's on the screen 
    evt.preventDefault(); 
    //this represent the thing that was clicked on 
    //console.log(this); 
    const value = document.querySelector('input[type="text"]').value
    const arr = value.split(","); 

    if (arr[0] === ""){
        let c1, c2, c3, c4; 
        [deck,c1] = cards.draw(deck); 
        [deck,c2] = cards.draw(deck); 
        [deck,c3] = cards.draw(deck); 
        [deck,c4] = cards.draw(deck); 
        playerHand.push(c1[0]); 
        playerHand.push(c3[0]); 
        computerHand.push(c2[0]); 
        computerHand.push(c4[0]); 
    }
    else{
        for (let i = 0; i < arr.length; i++){
            let card; 
    
            [deck,card] = cards.drawCorrectCard(deck,arr[i]); 
            
            if (i >= 4){
                deck.push(card[0]); 
            }
            else{ 
                if (i == 0 || i == 2){
                    playerHand.push(card[0]); 
                }
                else if (i == 1 || i == 3){
                    computerHand.push(card[0]); 
                }
            }
        }
    }
    
    //Test deck: 2,5,2,5,J,Q,K
    // {suit: "clubs", rank: 'A'}
    console.log(deck); 
    //remove the start elements on the dom 
    create.removeByClassName('start'); 

    //create computer tracker 
    const computerTracker = document.createElement('div'); 
    computerTracker.className = "computer"; 

    create.renderEntry(root,"Computer Hand - Total: ?","computer"); 

    root.appendChild(computerTracker); 

    create.renderCard("","",computerTracker,"special"); //render this card not visible to the player
    create.renderCard(computerHand[1].rank, computerHand[1].suit,computerTracker);

    //create player tracker 
    const playerTracker = document.createElement('div'); 
    playerTracker.className = "player"; 
    const playerSum = getCurrentSum(playerHand); 
    create.renderEntry(root,`Player Hand - Total: ${playerSum}`,"player"); 

    root.appendChild(playerTracker); 

    create.renderCard(playerHand[0].rank, playerHand[0].suit,playerTracker);
    create.renderCard(playerHand[1].rank, playerHand[1].suit,playerTracker);

    const hitAndStand = document.createElement('div'); 
    hitAndStand.className = "hns"
    create.renderButton(hitAndStand, "hit"); 
    create.renderButton(hitAndStand, "stand"); 
    root.appendChild(hitAndStand); 
    // document.getElementsByClassName('game')[0].appendChild(div); 

    const buttonHit = document.getElementsByClassName('hit')[0]; 

    buttonHit.addEventListener('click',handleHit); 

    const buttonStand = document.getElementsByClassName('stand')[0]; 

    buttonStand.addEventListener('click',handleStand); 
}

function handleHit(evt){

    evt.preventDefault(); 
    let sumPlayer = getCurrentSum(playerHand); 
    let sumComputer = getCurrentSum(computerHand); 

    if (!finished){
        if (sumPlayer <= 21){
            //draw card 
            const result = cards.draw(deck); 
            //push to playerHand
            playerHand.push(result[1][0]); 
            deck = result[0] 
            
            sumPlayer = getCurrentSum(playerHand); 
            const last = playerHand.slice(-1)[0]
            create.renderCard(last['rank'],last['suit'],document.getElementsByClassName('player')[0]);
            document.getElementById("player").textContent = `Player Hand - Total: ${sumPlayer}`; 
            if (sumPlayer > 21){
                seeWhoWon(); 
            }
        }
        else{
            document.getElementById("player").textContent = `Player Hand - Total: ${sumPlayer}`
            create.renderWhoWin(root, "Player Lost!!"); 
            finished = true; 
        }
    }
}

function handleStand(evt){
    evt.preventDefault(); 
    let playersum = getCurrentSum(playerHand); 
    let computerSum = getCurrentSum(computerHand); 

    if (!finished){
        while (computerSum < 21){
            if ((computerSum >= 17)){ //if computer sum bigger than 17, stand 
                break; 
            }
            //computer will hit 
            const result = cards.draw(deck); 
            computerHand.push(result[1][0]); 
            deck = result[0]     
            const last = computerHand.slice(-1)[0]
            create.renderCard(last['rank'],last['suit'],document.getElementsByClassName('computer')[0]);
            computerSum = getCurrentSum(computerHand); 
            document.getElementById("computer").textContent = `Computer Hand - Total: ${computerSum}`; 
        }
        seeWhoWon();
    }
}

function seeWhoWon(){
    const sumPlayer = getCurrentSum(playerHand); 
    const sumComputer = getCurrentSum(computerHand); 
    document.getElementById("computer").textContent = `Computer Hand: Total - ${sumComputer}`; 
    if (sumComputer > 21){
        create.renderWhoWin(root, "Player Won!!"); 
    }
    else if (sumPlayer > 21){
        create.renderWhoWin(root, "Computer Won!!"); 
    }
    else if (sumPlayer < sumComputer){
        create.renderWhoWin(root, "Computer Won!!"); 
    }
    else if (sumPlayer > sumComputer){
        create.renderWhoWin(root, "Player Won!!"); 
    }
    else{
        create.renderWhoWin(root, "A Tie!"); 
    }
    document.getElementById('special').textContent = `${computerHand[0].rank}${computerHand[0].suit}`;  
    finished = true; 

    create.renderButton(document.getElementsByClassName("hns")[0],"history"); 
    document.getElementsByClassName("history")[0].addEventListener('click',handleHistory); 
    create.renderTextField(document.getElementsByClassName("hns")[0],"Enter Optional Initial","initials"); 

} 

async function handleHistory(evt){
    evt.preventDefault(); 
    const initials = document.querySelector("input[type='text']").value; 
    const currentdata = packageData(initials); 
    document.body.innerHTML = ''; 
    //make fetch request to app.mjs 
    const response = await fetch('http://localhost:3000/api/scores', {
        method: "POST",
        headers: {
            "content-type": "application/json"
        }, 
        body: JSON.stringify(currentdata)
    }); 
    // const data = await response.json(); 

    const request = await fetch('http://localhost:3000/api/scores', {
        method: "GET", 
        headers: {
            "content-type": "application/json"
        }
    }) ;
    const newstuff = await request.json();
    console.log(newstuff); 
    create.renderHistory(document.body,newstuff); 

}

function getCurrentSum(deck){
    //TODO: Account for Aces 
    // Iteraate through all cards, if ace, see if it goes over with 10, if yes, return sum with 10. If no, return sum with 1. 
    const ranks = [] 
    deck.forEach((element)=>{
        ranks.push(cards.convertSuite(element['rank'])); 
    })

    //calculate initial sum with A being 1
    let sum = ranks.reduce((accumulator,currentvalue) => {
            return accumulator+currentvalue; //0 is initial value
    },0);

    //recheck to see if any A can be 10. 
    ranks.forEach((element)=>{
        if (element == 1){
            if ((sum + 10) < 21){ //if it's possible to have 21 with an ace
                sum = sum + 10; 
            }
        }
    })

    return sum; 
}

function packageData(initials){
    const date = new Date().toUTCString().slice(5, 16);
    const database = {
        "initials": initials,
        "playerHand" : playerHand, 
        "computerHand" : computerHand, 
        "playerScore" : getCurrentSum(playerHand), 
        "computerScore": getCurrentSum(computerHand),
        "dateCreated": date, 
    }
    return database; 
}



function main(){
    //only run when DOM is completely loaded 
    const button = document.querySelector('input[type="submit"]'); 
    button.addEventListener('click',handleClick); 
}

document.addEventListener('DOMContentLoaded', main); //wait until dom loads 
create.renderEntry(document.querySelector("form"), "Enter 4 numbers separated by commas to represent player and computer hand. Any more numbers entered will be set to the top of the starting deck. Enter without any entries for random shuffling. Have fun!","description")
main()


