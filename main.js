//
//BlackJack app
//

// Card variables
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'],
    values = ['Ace', 'King', 'Queen', 'Jack',
    'Ten', 'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two'];

// DOM variables
let textArea = document.getElementById('text-area'),
    newGameButton = document.getElementById('new-game'),
    hitButton = document.getElementById('hit'),
    stayButton = document.getElementById('stay');

// Game variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    playerCards = [],
    dealerCards = [],
    playerScore = 0,
    dealerScore = 0,
    deck = [],
    blackjack = false;

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function() {
    gameStarted = true;
    gameOver = false;
    playerWon = false;

    deck = createDeck();
    shuffleDeck(deck);
    dealerCards = [getNextCard(), getNextCard()];
    playerCards = [getNextCard(), getNextCard()];

    textArea.innerText = 'The game has started!';
    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';
    showStatus();
});

hitButton.addEventListener('click', function() {
    playerCards.push(getNextCard());
    checkForEndOfGame();
    showStatus();
})

stayButton.addEventListener('click', function() {
    gameOver = true;
    checkForEndOfGame();
    showStatus();
})

function createDeck() {
    let deck = [];
    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {

        for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx]
            };
            deck.push( card );
        }
    }
    return deck;
}

function shuffleDeck() {
    for (var i = 0; i < deck.length; i++) {
        let swpIndx = Math.trunc(Math.random() * deck.length);
        let tmpIndx = deck[swpIndx];
        deck[swpIndx] = deck[i];
        deck[i] = tmpIndx;
    }
}

function getCardString(card) {
    return card.value + ' of ' + card.suit;
}

function getCardNumericValue(card){
    switch (card.value) {
        case 'Ace':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7;
        case 'Eight':
            return 8;
        case 'Nine':
            return 9;
        default:
            return 10;
    }
}

function getScore(cardArray) {
    let score = 0;
    let hasAce = false;
    for (var i = 0; i < cardArray.length; i++) {
        let card = cardArray[i];
        score += getCardNumericValue(card);
        if (card.value === 'Ace') {
            hasAce = true;
        }
    }
    if (hasAce && score + 10 <= 21) {
        return score + 10
    }

    return score
}

function updateScore() {
    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);
}

function checkForEndOfGame() {
    updateScore();

    if (gameOver) {
        while (dealerScore < playerScore
                && playerScore <= 21
                && dealerScore <= 21) {
            dealerCards.push(getNextCard());
            updateScore();
        }
    }

    if (playerScore > 21) {
        playerWon = false;
        gameOver = true;
    } else if (dealerScore > 21) {
        playerWon = true;
        gameOver = true;
    } else if (gameOver) {
        if (playerCards > dealerCards) {
            playerWon = true;
        } else {
            playerWon = false;
        }
    }
}

function showStatus() {
    if (!gameStarted) {
        textArea.innerText = 'Welcome to Blackjack!';
        return
    }

    let dealerCardString = '';
    for (var i = 0; i < dealerCards.length; i++) {
        dealerCardString += getCardString(dealerCards[i]) + '\n';
    }

    let playerCardString = '';
    for (var i = 0; i < playerCards.length; i++) {
        playerCardString += getCardString(playerCards[i]) + '\n';
    }

    updateScore();

    textArea.innerText =
    'Dealer has:\n' +
    dealerCardString +
    '(score: ' + dealerScore + ')\n \n' +


    'Player has:\n' +
    playerCardString +
    '(score: ' + playerScore + ')\n \n';

    if (playerScore === 21 || dealerScore === 21) {
        gameOver = true;
        blackjack = true
    }

    if (playerCards.length === 5 && playerScore < 21) {
        playerWon = true;
        gameOver = true
    } else if (dealerCards.length === 5 && dealerScore < 21) {
        playerWon = false;
        gameOver = true;
    }

    if (gameOver) {
        if (playerWon) {
            textArea.innerText += 'Player Won!';
        } else if (blackjack) {
            textArea.innerText += 'Blackjack!';
        } else {
            textArea.innerText += 'Dealer Won.';
        }
        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
    }
}

function getNextCard() {
    return deck.shift();
}
