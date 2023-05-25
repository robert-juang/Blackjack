// cards.mjs
const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};
const suits_rev = {'♠️' : 'SPADES','❤️' : 'HEARTS', '♣️': 'CLUBS','♦️': 'DIAMONDS'}
function range(...args){
    /*
    Acts like a for loop 
    */
    const parameters = [...args]; //don't forget to add parameters here 

    let my_array = []; 

    //switch statement for different parameters  
    switch(parameters.length){
        case 1:   
            for (let i = 0; i < parameters[0]; i++){
                my_array.push(i);  
            }
            break; 
        case 2:
            for (let i = parameters[0]; i < parameters[1]; i++){
                my_array.push(i);  
            }
            break;
        case 3: 
            for (let i = parameters[0]; i < parameters[1]; i = i + (parameters[2])){ //fixed a small bug here with increment counter 
                my_array.push(i);  
            }
            break; 
    }

    return my_array; 
}

function generateDeck(){
    /*
    Manual implementation to generate Deck which looks ugly but at least works 
    */
    let deck = []; 

    //ace
    deck.push({"suit": "❤️", "rank": 'A'}, {"suit": "♠️", "rank": 'A'},{"suit": "♣️", "rank": 'A'},{"suit": "♦️", "rank": 'A'});
    
    //create card objects for 2-10
    for (let i = 2; i < 11; i++){
            deck.push({"suit": "❤️", "rank": i.toString()}, {"suit": "♠️", "rank": i.toString()},{"suit": "♣️", "rank": i.toString()},{"suit": "♦️", "rank": i.toString()});
    }

    //create special cards for ['J', 'Q', 'K']
    deck.push({"suit": "❤️", "rank": 'J'}, {"suit": "♠️", "rank": 'J'},{"suit": "♣️", "rank": 'J'},{"suit": "♦️", "rank": 'J'});
    deck.push({"suit": "❤️", "rank": 'Q'}, {"suit": "♠️", "rank": 'Q'},{"suit": "♣️", "rank": 'Q'},{"suit": "♦️", "rank": 'Q'});
    deck.push({"suit": "❤️", "rank": 'K'}, {"suit": "♠️", "rank": 'K'},{"suit": "♣️", "rank": 'K'},{"suit": "♦️", "rank": 'K'});
    
    return deck; 
}

function shuffle(deck){
    /*
    Given the deck, shuffle it 

    you can use Math.random() which will generate a number between 0 and 1 or 
    use getRandomInt(n), which will generate a random number from 0,...,n-1

    the shuffle I will be implementing is the Fisher-Yates shuffle 
    */
    let currentIndex = deck.length; 
    let copy = deck.map((x) => x); //make sure to copy without modifying the original deck 

    while (currentIndex != 0){
        let randomIndex = Math.floor(Math.random() * currentIndex); 
        currentIndex--; 

        [copy[currentIndex], copy[randomIndex]] = [copy[randomIndex], copy[currentIndex]];
    }

    return copy; 
}

function getRandomInt(max) {
    //this returns a random integer which is used in tne
    return Math.floor(Math.random() * max);
  }

function draw(cardsArray,n){ 
    /*
    remove the last n elements 
    n is optional with default value: 1 
    */
    if (n === undefined){ //default case 
        n = 1; 
    }

    let modify_this = [...cardsArray];
    
    let elements = [] 
    for (let i = 0; i < n; i++){
        let removed = modify_this.pop(); 
        elements.push(removed); 
    }
    const ret = [modify_this,elements]; 

    return ret; 
}

function deal(cardsArray, numHands,cardsPerHand){
    /*
    deals cards
    cardsArray is an Array of card objects
    numHands is the number of hands of cards to create with default 2
    cardsPerHand is the number of cards per hand with the default 5
    */
    if (numHands === undefined){ //default values 
        numHands = 2; 
    }
    if (cardsPerHand === undefined){
        cardsPerHand = 5; 
    }

    let big_array = [] 
    let copy_array = cardsArray.map((x) => x); //make sure to copy without modifying the original deck (this is the second time I had to fix this; must take note of this in the future) 

    //get rid of the last 4 cards of the deck 
    for (let i = 0; i < numHands; i++){ //will iterate 2 times 
        let temp_arr = [] 
        for (let j = 0; j < cardsPerHand; j++){ //will iterate 5 times 
            let temp_card = copy_array.pop(); 
            temp_arr.push(temp_card); 
        }
        big_array.push(temp_arr); 
    }
    return {"deck": copy_array,"hands": big_array}; 

}

function handToString(hand, sep, numbers){
    /*
    Hand is an Array of card objects 
    Sep is the String to place between cards 
    number is another input specifying whether or not to include the position of the card in the Array starting at index 1 
    */
   if (sep === undefined){ //default case 
        sep = '  '; 
   }
   if (numbers === undefined){
        numbers = false; 
   }

    let result_string = ""; //initialize an empty string
    for (let i = 0; i < hand.length; i++){
        let one_card; 
        if (i !== hand.length - 1){ //make sure the separator is working properly (when you get to the last element do not add separator)
            one_card = hand[i]['rank'] + hand[i]['suit'] + sep; 
        } else{
            one_card = hand[i]['rank'] + hand[i]['suit']; 
        }

        if (numbers === false){ //check for third parameter 
            result_string += one_card; 
        }
        if (numbers === true){
            result_string += (i+1 + ": " + one_card);  
        }
    }
    return result_string; 
}

function matchesAnyProperty(obj, matchObj){
    /*
    will check all keys in obj. If anyh of the keys in object match a key in mathObj and have the same
    value, return true. Otherwise, return false. 
    */

   if ((suits_rev[obj['suit']] === suits_rev[matchObj['suit']]) || (obj['rank'] === matchObj['rank']) || ((obj['rank'] == 8))){ //check if either rank or suit match 
        return true; 
   }

    return false; 
}

function drawUntilPlayable(deck, matchObject){
    /*
    starting from the end of the deck Array and going backwards 
    */
    let newarr = []; //add in array of removed elements and array consisting of the cards in deck with some number of elements removed from the end
    let rank_obj = matchObject["rank"];
    let suit_obj = matchObject["suit"]; 
    let copy = deck.map((x) => x); //make a copy to avoid messing with the deck that is passed in (third time I've had to do this jesus)

    for (let i = 0; i < deck.length; i++){
        let remove_this = copy.pop(); 
        newarr.push(remove_this); 
        if (matchesAnyProperty(remove_this,matchObject)){ //use matchesAnyProperty 
            break; 
        }
    }
    newarr = [copy, newarr]; 
    return newarr; 
}

function drawCorrectCard(deck,match){
    let card; 
    function convertMatch(match){
        if (match == 1){return 'A'}
        else if(match == 11){return 'J'}
        else if(match == 12){return 'Q'}
        else if(match == 13){return 'K'}
        else{return match}
    }

    match = convertMatch(match); 

    for (let i = 0; i < deck.length; i++){
        if (deck[i]['rank'] == match){
            card = deck.splice(i,1); 
            return [deck,card]; 
        }
    }
    return [deck,card]; 
}

function convertSuite(suite){
    if (suite == 'A'){return 1}
    else if(suite == 'J' || suite == 'Q' || suite == 'K'){return 10}
    else{return parseInt(suite)}
}

export{
    range,
    generateDeck,
    shuffle,
    draw,
    deal,
    handToString,
    matchesAnyProperty,
    drawUntilPlayable, 
    drawCorrectCard,
    convertSuite,
}

