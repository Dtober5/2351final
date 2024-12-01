// Variables for the game
var playerHand = [];
var dealerHand = [];
var deck = [];
var playerScore = 0;
var dealerScore = 0;

// HTML Elements
var playerHandDiv = document.getElementById("player-hand");
var dealerHandDiv = document.getElementById("dealer-hand");
var playerScoreSpan = document.getElementById("player-score");
var dealerScoreSpan = document.getElementById("dealer-score");
var message = document.getElementById("message");
var deckImage = document.getElementById("deck-image");

// Function to create a new deck of cards
function createDeck() {
    var suits = ["hearts", "diamonds", "clubs", "spades"]; // Lowercase suits
    var values = [
        "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
        "jack", "queen", "king"
    ]; // Lowercase values
    deck = []; // Start with an empty deck

    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < values.length; j++) {
            var card = {
                suit: suits[i],
                value: values[j],
                image: "./" + values[j] + "_of_" + suits[i] + ".png" // Use lowercase paths
            };
            deck.push(card); // Add the card to the deck
        }
    }
}

// Function to shuffle the deck
function shuffleDeck() {
    for (var i = deck.length - 1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var temp = deck[i];
        deck[i] = deck[randomIndex];
        deck[randomIndex] = temp;
    }
}

// Function to calculate the score of a hand
function calculateScore(hand) {
    var score = 0;
    var aces = 0;

    for (var i = 0; i < hand.length; i++) {
        var card = hand[i];
        if (card.value === "ace") {
            aces++;
            score += 11;
        } else if (card.value === "jack" || card.value === "queen" || card.value === "king") {
            score += 10;
        } else {
            score += parseInt(card.value, 10);
        }
    }

    // Adjust the score for aces
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

// Function to deal a card
function dealCard(hand, handDiv) {
    var card = deck.pop(); // Take the top card from the deck
    hand.push(card); // Add the card to the player's or dealer's hand

    var cardBack = document.createElement("img");
    cardBack.src = "./back.png"; // Lowercase file path
    cardBack.alt = "Card Back";

    var cardFace = document.createElement("img");
    cardFace.src = card.image; // Use card's lowercase image path
    cardFace.alt = card.value + " of " + card.suit;
    cardFace.style.visibility = "hidden";

    document.body.appendChild(cardBack); // Add the card to the body temporarily for animation

    // Get positions for animation
    var deckRect = deckImage.getBoundingClientRect();
    var handRect = handDiv.getBoundingClientRect();

    // Offset each card so they appear side by side
    var offsetX = hand.length * 90;

    // Animate the card moving to the hand
    gsap.fromTo(cardBack, {
        x: deckRect.left,
        y: deckRect.top
    }, {
        x: handRect.left - deckRect.left + offsetX,
        y: handRect.top - deckRect.top,
        duration: 0.5,
        onComplete: function () {
            cardBack.style.visibility = "hidden";
            cardFace.style.visibility = "visible";
            handDiv.appendChild(cardFace); // Add the card to the hand area
        }
    });
}

// Function to update the UI
function updateUI() {
    playerScoreSpan.textContent = playerScore;
    dealerScoreSpan.textContent = dealerScore;
}

// Function to start the game
function startGame() {
    createDeck();
    shuffleDeck();

    playerHand = [];
    dealerHand = [];
    playerHandDiv.innerHTML = ""; // Clear player hand
    dealerHandDiv.innerHTML = ""; // Clear dealer hand

    dealCard(playerHand, playerHandDiv);
    dealCard(playerHand, playerHandDiv);
    dealCard(dealerHand, dealerHandDiv);
    dealCard(dealerHand, dealerHandDiv);

    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);
    updateUI();
    message.textContent = "Hit or Stand?";
}

// Event listeners for buttons
document.getElementById("hit-btn").addEventListener("click", function () {
    dealCard(playerHand, playerHandDiv);
    playerScore = calculateScore(playerHand);
    updateUI();

    if (playerScore > 21) {
        message.textContent = "You busted! Dealer wins.";
    }
});

document.getElementById("stand-btn").addEventListener("click", function () {
    while (dealerScore < 17) {
        dealCard(dealerHand, dealerHandDiv);
        dealerScore = calculateScore(dealerHand);
    }

    updateUI();

    if (dealerScore > 21 || playerScore > dealerScore) {
        message.textContent = "You win!";
    } else if (playerScore === dealerScore) {
        message.textContent = "It's a tie!";
    } else {
        message.textContent = "Dealer wins!";
    }
});

document.getElementById("reset-btn").addEventListener("click", startGame);

// Start the game when the page loads
startGame();
