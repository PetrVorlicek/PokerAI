/* Import throwing an error - fix later */
//import "./deck.mjs";

/*---   DECK.JS START   ---*/ 

//Card class - represents a card
class Card {
    constructor(value, color) {
        this.value = value;
        this.color = color;
    }
}
//Deck class - represents a deck
class Deck {

    //Creates all cards in poker deck
    createCards() {
        //values of the cards - 14 is Ace, 13 is King etc.
        const values = [2,3,4,5,6,7,8,9,10,11,12,13,14];
        //colors of the cards
        const colors = ["spades","hearts","clubs","diamonds"];
        let cards = [];
        //all combinations of cards values and colors
        for (const value of values) {
            for(const color of colors) {

                let card = new Card(value, color);
                cards.push(card);
            }
        }
        return cards;
    }

    //Shuffles the deck
    shuffle(cards) {
        //copy the cards into playing deck
        const shuffledCards = []
        //TODO: refaktorovat kopírování karet
        for(const card of cards){
            shuffledCards.push(new Card(card.value, card.color));
        }
        //shuffle playing deck
        for (let i = shuffledCards.length - 1; i > 0; i --) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
        }
        return shuffledCards;
    }

    serve()
    {
        if (this.actualCards.length > 0)
        {
            return this.actualCards.pop();
        }
    }
    
    constructor() {
        //all cards - to remember all cards and not to initialize the cards every turn
        this.allCards = this.createCards();
        //actual cards - deck to play with
        this.actualCards = this.shuffle(this.allCards);
    }


}

/*---   DECK.JS END ---*/

class Player {
    constructor()
    {
        this.hand = []
    }

    takeCards(cards)
    {
        //Take exactly two cards if hand is empty
        if(cards.length === 2 && this.hand.length === 0)
        {
            this.hand = cards;
        } else console.log("Player has problem with taking cards!");
    }

    //Log player cards for testing
    showCards()
    {
        console.log("Player Cards:")
        for (const card of this.hand)
        {
            console.log([card.value, card.color])
        }
    }
}


class Game {
    constructor(players)
    {       
        this.deck = new Deck()  //playing deck
        this.table = []         //table cards
        this.players = players  //table players
    }

    //Log table cards for testing
    showTable()
    {
        console.log("Table Cards:")
        for (const card of this.table)
        {
            console.log([card.value, card.color])
        }
    }

    //first phase of game
    serve()
    {
        //Serve each player
        for (const player of this.players)
        {
            //Serve player 2 cards
            const cards = []
            for (let i = 0; i < 2; i++)
            {
                cards.push(this.deck.serve())
            }
            player.takeCards(cards)
        }
    }

    // second phase of game
    flop()
    {
        for (let i = 0; i < 3; i++)
        {
            //burn card
            this.deck.serve()
            //add card to the table
            this.table.push(this.deck.serve())
        }
    }

    // third phase of game
    turn()
    {
            //burn card
            this.deck.serve()
            //add card to the table
            this.table.push(this.deck.serve())
    }

    // final phase of game
    river()
    {
        //haha
        this.turn()
    }
}

/* EVALUATION FUNCTION */
// subset function - stolen from internet
const findCombinations = (array, length) =>
{
    penalty = array.length - length
    const combinations = (currentArray, possibleArray, index, currentPenalty) =>
    {
        if (possibleArray.length <= currentPenalty || currentPenalty === 0 )
        {
            console.log("currentArray")
            return currentArray[index].concat(possibleArray)
        }
        let card = possibleArray.pop()
        console.log(possibleArray.length)
        // dont add the card and take penalty
        currentArray = combinations(currentArray, possibleArray, index, currentPenalty - 1) 
        // add the card to the deck
        if (currentArray[index]) currentArray[index].push(card)
        else currentArray.push([card])
        currentArray = combinations(currentArray, possibleArray, currentArray.length, currentPenalty)
        return currentArray    
    }
    return combinations([[]], array, 0, penalty)
}




// scoring function for 2 and more cards
const gameScore = (cards) =>
{
    // start counting score, initiate on high card
    let score = 0.0

    // check flush
    const color = cards[0].color
    let flush = true
    for (let i = 1; i<cards.length; i++)
    {
        if (color != cards[i].color) 
        {
            flush = false
        }

    }

    // check straight
    let last = cards[cards.length-1].value
    let straight = true
    for (let i = cards.length-2; i >= 0; i--)
    {
        if (last === cards[i].value - 1)
        {
            last = cards[i].value
        }
        else 
        {
            straight = false;
        }

    }


    // score straight flush, flush, straight
    if (straight && flush)
    {
        console.log("straight flush")
        return score + cards[0] * 3560000000
        
    }
    if(flush)
    {
        let multiplier = 3200000
        for (let i = 0; i < cards.length; i++)
        {
            score += cards[i] * multiplier
            multiplier = multiplier / 20
        }
        console.log("flush")
        return score
        
    }
    if(straight)
    {
        console.log("straight")
        return score + cards[cards.length-1] * 160000
        
    }

    // Check four, fullhouse, three, pairs
    // Create key - value map
    const cardMap = new Map()
    for (const card of cards)
    {
        if (cardMap.has(card.value)) 
        {
            cardValue = cardMap.get(card.value)
            cardMap.set(card.value, cardValue + 1 )
        }
        else 
        {
            cardMap.set(card.value, 1)
        }
    }

    // get highest 
    const values = cardMap.values()
    const max = Math.max(...values)
    
    let high = 0
    let firstPair = 0
    let secondPair = 0
    let three = 0
    let four = 0

    //score combinations
    switch (max)
    {
        
        case 1:
            score += cards[0].value
            break;

        case 2:
            cardMap.forEach((value, key) =>
            {
                if (value === 2)
                {
                    if (firstPair === 0)
                    {
                        firstPair = key
                    }
                    else 
                    {
                        secondPair = firstPair
                        firstPair = key
                    }
                }
                else 
                {
                    if (high === 0)
                    high = key
                }
            })
            score += 20*firstPair + 400*secondPair + high
            break;

        case 3:
            cardMap.forEach((value, key) =>
            {
                if (value === 3)
                {
                    three = key
                }
                else if(value === 2)
                {
                    firstPair = key
                }
                else
                {
                    if (high === 0)
                    high = key
                }
            })
            
            if (firstPair > 0) score = three * 6400000 + firstPair * 20 + high
            else score = three * 8000 + high
            break;

        case 4:
            cardMap.forEach((value, key) =>
            {
                if (value === 4)
                {
                    four = key
                }
                else
                {
                    high = key
                }
            })
            score = four * 1280000000 + high
            break;
    }
    return score
}

const eval = (game_cards, player_cards) => 
{   
    // return 0 for no cards
    // 0.0 for float, because in current state score can't be fit into int
    if (game_cards.length + player_cards.length === 0) return 0.0
    
    // copy the table and hand into cards
    let cards = []
    for (const card of game_cards)
    {
        cards.push(new Card(card.value, card.color))
    }
    for (const card of player_cards)
    {
        cards.push(new Card(card.value, card.color))
    }
    
    // return value for one card
    if (cards.length === 1) return 0.0 + cards[0].value

    // sort cards
    cards.sort((a, b) =>  b.value - a.value)

    let highScore = 0.0
    let highHand = []
    if (cards.length > 5)
    {
        //  split into subsets of 5
        
        let hands = findCombinations(cards, 5, 5)
        for (let hand in hands)
        {
            let currentScore = gameScore(hand)
            if (currentScore > highScore)
            {
                highHand = hand
                highScore = currentScore
            }
        }
    }
    else
    {
        highScore = gameScore(cards)
        highHand = cards
    }

    return highHand
}




/*  TESTING  */

//Serving
console.log("Serving")
let player = new Player();
let game = new Game([player])
game.serve()
player.showCards()

//Flop
console.log("Flop")
game.flop()
game.showTable()

//Turn
console.log("Turn")
game.turn()
game.showTable()

//River
console.log("River")
game.river()
game.showTable()
console.log()

arr = findCombinations(["A","B","C"],2)

console.log(arr)