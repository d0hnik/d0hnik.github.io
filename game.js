let players = [];
let deck = [];
let currentPlayerIndex = 0;
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

module.exports = { createDeck, shuffle, values  };

const DRINKS_AMOUNT_FIRST_ROUND = 2;
const DRINKS_AMOUNT_SECOND_ROUND = 4;
const DRINKS_AMOUNT_THIRD_ROUND = 6;
const DRINKS_AMOUNT_FOURTH_ROUND = 8;

function setupPlayers() {
    let playerCount = document.getElementById('player-count').value;

    if (playerCount <= 1) {
        playerCount = 2;
    } else if (playerCount > 6) {
        playerCount = 6;
    }

    const nameInputsDiv = document.getElementById('name-inputs');
    nameInputsDiv.innerHTML = '';

    for (let i = 1; i <= playerCount; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `player-${i}`;
        input.placeholder = `SET PLAYER ${i} NAME`;
        input.required = true;
        nameInputsDiv.appendChild(input);
        nameInputsDiv.appendChild(document.createElement('br'));
    }

    // Smoothly transition the background
    const descriptionDiv = document.getElementById('description');
    const playerSetupDiv = document.getElementById('name-setup');

    descriptionDiv.classList.add('slide-out-right');


    setTimeout(() => {

        descriptionDiv.style.display = 'none';


        playerSetupDiv.style.display = 'flex';
        playerSetupDiv.classList.add('slide-in-left');


        setTimeout(() => {
            playerSetupDiv.classList.remove('slide-in-left');
        }, 400); // Match this timeout with the animation duration
    }, 400); // Wait for the slide-out duration to finish
}

function createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

    deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value: value, suit: suit });
        }
    }

    deck = shuffle(deck);
    return deck;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function dealCards() {
    for (let i = 0; i < 4; i++) {
        players.forEach(player => {
            player.cards.push(deck.pop());
        });
    }
}

function createPlayers(playerCount) {
    for (let i = 1; i <= playerCount; i++) {
        let playerName = document.getElementById(`player-${i}`).value;
        if (playerName === "") {
            playerName = `Player ${i}`
        }
        players.push({
            name: playerName,
            cards: [],
            drinksGiven: 0,
            drinksReceived: 0
        });
    }
}

function startGame() {
    let playerCount = document.getElementById('player-count').value;
    
    playerCount = validatePlayerCount(playerCount);
    createPlayers(playerCount);

    createDeck();
    dealCards();
    
    document.getElementById('name-setup').style.display = 'none';
    document.getElementById('game').style.display = 'flex';
    firstMove()
}

function validatePlayerCount(playerCount) {
    if (playerCount <= 1) {
        playerCount = 2;
    }
    else if (playerCount > 6) {
        playerCount = 6;
    }
    return playerCount;
}

function firstMove() {
    const currentPlayer = players[currentPlayerIndex];
    const gameWindowDiv = document.getElementById('game-window');
    const gameWindow = document.createElement('div');
    gameWindow.className = 'game-window';
    gameWindow.id = `${currentPlayer.name}`;

    setCurrentPlayerInfo(currentPlayer);
    displayOtherPlayersStats();
    displayCurrentPlayerTurnText(gameWindow)
    
    const playerCardsDiv = renderCards(currentPlayer);
    gameWindow.appendChild(playerCardsDiv);
    gameWindowDiv.appendChild(gameWindow);
    createNextMoveButton(gameWindow, currentPlayer)
    
}

function renderCards(currentPlayer) {
    let i = 0;
    const playerCardsDiv = document.createElement('div');
    playerCardsDiv.className = 'cards';
    currentPlayer.cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'cardBack redBack'
        cardDiv.id = `${currentPlayer.name} ${i}`;
        playerCardsDiv.appendChild(cardDiv);
        i++;
    })
    return playerCardsDiv;
}

function createNextMoveButton(gameWindow, currentPlayer) {
    const nextMoveButtonContainer = document.createElement('div');
    const nextMoveButton = document.createElement('button');

    nextMoveButtonContainer.className = 'nextMoveButtonContainer';
    
    nextMoveButton.setAttribute('onclick', 'displayColorChoice()');
    nextMoveButton.className = 'nextMoveButton';
    nextMoveButton.innerText = "TURN CARD";
    nextMoveButton.id = `${currentPlayer.name} btn`
    nextMoveButtonContainer.appendChild(nextMoveButton);
    gameWindow.appendChild(nextMoveButtonContainer);
}

function displayCurrentPlayerTurnText(gameWindow) {
    const currentPlayerTextContainer = document.createElement('div');
    currentPlayerTextContainer.className = 'currentPlayerTextContainer';
    
    const currentPlayerName = document.createElement('div');
    currentPlayerName.className = 'currentPlayerName';
    currentPlayerName.innerText = players[currentPlayerIndex].name;
    
    const currentPlayerTurnText = document.createElement('div');
    currentPlayerTurnText.className = 'currentPlayerTurnText';
    currentPlayerTurnText.innerText = "TURN";
    
    currentPlayerTextContainer.appendChild(currentPlayerName);
    currentPlayerTextContainer.appendChild(currentPlayerTurnText);
    gameWindow.appendChild(currentPlayerTextContainer);
}

function setCurrentPlayerInfo(currentPlayer) {
    document.getElementById('current-player-name').innerText = currentPlayer.name;
    document.getElementById('current-player-given-drinks').innerText = currentPlayer.drinksGiven;
    document.getElementById("current-player-taken-drinks").innerText = currentPlayer.drinksReceived;
}

function displayOtherPlayersStats() {
    const otherPlayersDiv = document.getElementById('other-player-stats');
    otherPlayersDiv.innerHTML = '';

    players.forEach((player, index) => {
        if (index !== currentPlayerIndex) {
            const playerStatContainer = document.createElement('div');
            playerStatContainer.className = 'other-player-stat-container';

            const playerNameContainer = document.createElement('div');
            playerNameContainer.className = 'other-player-name-container';
            playerNameContainer.innerText = player.name;

            const playerDrinksContainer = document.createElement('div');
            playerDrinksContainer.className = 'other-player-drinks-container';
            
            const givenDrinksDiv = document.createElement('div');
            givenDrinksDiv.className = 'other-player-drinks';

            const givenTitle = document.createElement('div');
            givenTitle.className = 'other-player-given-title';
            givenTitle.innerText = 'Given';

            const givenAmount = document.createElement('div');
            givenAmount.className = 'other-player-given-amount';
            givenAmount.innerText = player.drinksGiven; // Mängija andnud jookide arv

            givenDrinksDiv.appendChild(givenTitle);
            givenDrinksDiv.appendChild(givenAmount);
            
            const takenDrinksDiv = document.createElement('div');
            takenDrinksDiv.className = 'other-player-drinks';

            const takenTitle = document.createElement('div');
            takenTitle.className = 'other-player-given-title';
            takenTitle.innerText = 'Taken';

            const takenAmount = document.createElement('div');
            takenAmount.className = 'other-player-taken-amount';
            takenAmount.innerText = player.drinksReceived; // Mängija saadud jookide arv

            takenDrinksDiv.appendChild(takenTitle);
            takenDrinksDiv.appendChild(takenAmount);

            playerDrinksContainer.appendChild(givenDrinksDiv);
            playerDrinksContainer.appendChild(takenDrinksDiv);

            playerStatContainer.appendChild(playerNameContainer);
            playerStatContainer.appendChild(playerDrinksContainer);

            otherPlayersDiv.appendChild(playerStatContainer);
        }
    });
}

function displayColorChoice() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('colorChoicePopUp').style.display = 'block';
}

function checkColorChoice(choice) {
    const currentPlayer = players[currentPlayerIndex];
    const card = currentPlayer.cards[0]
    const cardSuit = card.suit;
    let isRightGuess;
    let nextAction;
    const amountToDrink = DRINKS_AMOUNT_FIRST_ROUND;
    
    if (choice === "red") {
        isRightGuess = cardSuit === "hearts" || cardSuit === 'diamonds';
    }
    else {
        isRightGuess = cardSuit === "spades" || cardSuit === "clubs";
    }
    
    flipCard('0', card, currentPlayer)

    updateDrinks(currentPlayer, amountToDrink, isRightGuess);
    currentPlayerIndex++;

    if (currentPlayerIndex < players.length) {
        nextAction = firstMove;
    }
    else {
        currentPlayerIndex = 0;
        nextAction = function() {
            nextMove('displayHigherLowerChoice()');
        };
    }
    
    if (isRightGuess === true) {
        rightGuess(amountToDrink, "colorChoicePopUp", nextAction)
    }
    else {
        wrongGuess(amountToDrink, "colorChoicePopUp", nextAction)
    }


}

function wrongGuess(amountToDrink, popupId, nextAction) {
    document.getElementById(`${popupId}`).style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    showWrongGuessPopUp(amountToDrink, nextAction);
}


function rightGuess(amountToDrink, popupId, nextAction) {
    document.getElementById(`${popupId}`).style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    showRightGuessPopUp(amountToDrink, nextAction);
}

function nextMove(btnFunction) {
    const currentPlayer = players[currentPlayerIndex];
    const playerDiv = document.getElementById(`${currentPlayer.name}`);
    setCurrentPlayerInfo(currentPlayer);
    displayOtherPlayersStats();
    playerDiv.style.display = 'block';
    const btn = document.getElementById(`${currentPlayer.name} btn`);
    btn.setAttribute('onclick', `${btnFunction}`);
}


function getCardValue(card) {
    return values.indexOf(card);
}

function displayHigherLowerChoice() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('higherLowerPopup').style.display = 'block';
}

function checkHigherLowerChoice(choice) {
    const currentPlayer = players[currentPlayerIndex];
    const prevCard = currentPlayer.cards[0];
    const currCard = currentPlayer.cards[1];
    const amountToDrink = DRINKS_AMOUNT_SECOND_ROUND;
    let isRightGuess;
    let nextAction;
    
    if (choice === 'higher') {
        isRightGuess = getCardValue(prevCard.value) < getCardValue(currCard.value);
    }
    else {
        isRightGuess = getCardValue(prevCard.value) > getCardValue(currCard.value);
    }

    flipCard('1', currCard, currentPlayer)

    updateDrinks(currentPlayer, amountToDrink, isRightGuess);
    
    currentPlayerIndex++;

    if (currentPlayerIndex < players.length) {
        nextAction = function() {
            nextMove('displayHigherLowerChoice()');
        };
    }
    else {
        currentPlayerIndex = 0;
        nextAction = function() {
            nextMove('displayBetweenChoice()');
        };
    }
    if (isRightGuess === true) {
        rightGuess(amountToDrink, "higherLowerPopup", nextAction)
    }
    else {
        wrongGuess(amountToDrink, "higherLowerPopup", nextAction)
    }
}

function displayBetweenChoice() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('betweenPopUp').style.display = 'block';
}

function checkBetween(choice) {
    const currentPlayer = players[currentPlayerIndex];
    const bottomCard = currentPlayer.cards[0];
    const topCard = currentPlayer.cards[1];
    const currCard = currentPlayer.cards[2];
    const amountToDrink = DRINKS_AMOUNT_THIRD_ROUND;
    let isRightGuess;
    let nextAction;
    
    const min = Math.min(bottomCard.value, topCard.value);
    const max = Math.max(bottomCard.value, topCard.value);

    const isBetween = currCard.value > min && currCard.value < max;
    
    if (choice === 'yes') {
        isRightGuess = isBetween;
    }
    else {
        isRightGuess = !isBetween;
    }

    flipCard('2', currCard, currentPlayer)

    updateDrinks(currentPlayer, amountToDrink, isRightGuess);
    
    currentPlayerIndex++;
    
    if (currentPlayerIndex < players.length) {
        nextAction = function() {
            nextMove('displayBetweenChoice()');
        };
    }
    else {
        currentPlayerIndex = 0;
        nextAction = function() {
            nextMove('displaySuitsChoice()');
        };
    }

    if (isRightGuess === true) {
        rightGuess(amountToDrink, "betweenPopUp", nextAction)
    }
    else {
        wrongGuess(amountToDrink, "betweenPopUp", nextAction)
    }
}

function displaySuitsChoice() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('suitPopUp').style.display = 'block';
}

function checkSuit(choice) {
    const currentPlayer = players[currentPlayerIndex];
    const card = currentPlayer.cards[3];
    const amountToDrink = DRINKS_AMOUNT_FOURTH_ROUND;
    let isRightGuess;
    let nextAction;
    
    isRightGuess = choice === card.suit;
    
    flipCard('3', card, currentPlayer)
    updateDrinks(currentPlayer, amountToDrink, isRightGuess);
    currentPlayerIndex++;

    if (currentPlayerIndex < players.length) {
        nextAction = function() {
            nextMove('displaySuitsChoice()');
        };
    }
    else {
        currentPlayerIndex = 0;
        nextAction = function() {
            displayGameOverScreen();
        };
    }

    if (isRightGuess === true) {
        rightGuess(amountToDrink, "suitPopUp", nextAction)
    }
    else {
        wrongGuess(amountToDrink, "suitPopUp", nextAction)
    }
}

function showWrongGuessPopUp(amountToDrink, nextAction) {
    setTimeout(function() {
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('wrongGuessPopUp').style.display = 'block';
        document.getElementById('drinks-lose').textContent = `${amountToDrink}`
        createButtonProceedAfterWrongGuess(nextAction);
    }, 1000);
}


function showRightGuessPopUp(amountToDrink, nextAction) {
    setTimeout(function() {
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('rightGuessPopUp').style.display = 'block';
        document.getElementById('drinks-win').textContent = `${amountToDrink}`
        createButtonProceedAfterRightGuess(nextAction);
    }, 1000);
}

function createButtonProceedAfterWrongGuess(nextAction) {
    const popUpWindow = document.getElementById('wrongGuessPopUp');
    const existingButtonDiv = popUpWindow.querySelector('.btn-container');
    if (existingButtonDiv) {
        popUpWindow.removeChild(existingButtonDiv);
    }
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'btn-container';
    const nextMoveButton = document.createElement('button');
    nextMoveButton.className = 'btn green';
    nextMoveButton.innerText = 'NEXT MOVE'
    nextMoveButton.onclick = function() {
        afterWrongGuess(nextAction);
    };
    buttonDiv.appendChild(nextMoveButton);
    popUpWindow.appendChild(buttonDiv);
}

function createButtonProceedAfterRightGuess(nextAction) {
    const popUpWindow = document.getElementById('rightGuessPopUp');
    const existingButtonDiv = popUpWindow.querySelector('.btn-container');
    if (existingButtonDiv) {
        popUpWindow.removeChild(existingButtonDiv);
    }
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'btn-container';
    const nextMoveButton = document.createElement('button');
    nextMoveButton.className = 'btn green';
    nextMoveButton.innerText = 'NEXT MOVE'
    nextMoveButton.onclick = function () {
        afterRightGuess(nextAction);
    };
    buttonDiv.appendChild(nextMoveButton);
    popUpWindow.appendChild(buttonDiv);
}

function afterWrongGuess(nextAction) {
    // Remove popup window
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('wrongGuessPopUp').style.display = 'none';
    document.getElementById('colorChoicePopUp').style.display = 'none';
    
    removePreviousPlayerCards();
    nextAction();
}

function afterRightGuess(nextAction) {
    // Remove popUp window
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('rightGuessPopUp').style.display = 'none';
    document.getElementById('colorChoicePopUp').style.display = 'none';
    
    removePreviousPlayerCards();

    nextAction();
}

function removePreviousPlayerCards() {
    if (currentPlayerIndex - 1 >= 0) {
        document.getElementById(`${players[currentPlayerIndex - 1].name}`).style.display = 'none';
    }
    if (currentPlayerIndex - 1 === - 1) {
        document.getElementById(`${players[players.length - 1].name}`).style.display = 'none';
    }
}

function updateDrinks(currentPlayer, amountToDrink, isRightGuess) {
    if (isRightGuess) {
        currentPlayer.drinksGiven += amountToDrink;
    } else {
        currentPlayer.drinksReceived += amountToDrink;
    }
}

function flipCard(cardID, card, currentPlayer) {
    const cardToChange = document.getElementById(`${currentPlayer.name} ${cardID}`);
    cardToChange.className = `card ${card.suit}${card.value}`
}

function displayGameOverScreen() {
    const currentPlayer = players[currentPlayerIndex];
    setCurrentPlayerInfo(currentPlayer);
    displayOtherPlayersStats();

    renderGameOverButtonsAndText();
    
}

function renderGameOverButtonsAndText() {
    const gameWindowDiv = document.getElementById('game-window')
    
    const gameOverContainer = document.createElement('div');
    gameOverContainer.className = 'gameOverContainer';
    gameWindowDiv.appendChild(gameOverContainer);

    const gameOverTextDiv = document.createElement('div');
    gameOverTextDiv.className = 'game-over-text';
    gameOverTextDiv.innerText = "GAME OVER";
    gameOverContainer.appendChild(gameOverTextDiv);


    const gameOverButtonsDiv = document.createElement('div');
    gameOverButtonsDiv.className = 'game-over-buttons';
    gameOverContainer.appendChild(gameOverButtonsDiv);
    

    const newGameButtonDiv = document.createElement('div');
    newGameButtonDiv.className = 'newGameButtonContainer';
    gameOverButtonsDiv.appendChild(newGameButtonDiv);

    const newGameButton = document.createElement('button');
    newGameButton.className = 'newGame button';
    newGameButton.innerText = 'NEW GAME';
    newGameButton.onclick = function () {
        newGame();
    }
    newGameButtonDiv.appendChild(newGameButton);
}


function newGame() {
    window.location.reload();
}