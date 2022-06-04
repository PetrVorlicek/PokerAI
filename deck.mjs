//Card class - represents a card
export class Card {
    constructor(value, color) {
        this.value = value;
        this.color = color;
    }
}
//Deck class - represents a deck
export class Deck {

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



