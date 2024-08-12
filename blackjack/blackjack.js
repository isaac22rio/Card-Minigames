let dealerSum = 0;
let playerSum = 0;
let dealerAceCount = 0;
let playerAceCount = 0; 
let cards = [];

let hittable = true; //allows the player (you) to draw while playerSum <= 21
const playerCards = document.querySelector(".player-cards");
const dealerCards = document.querySelector(".dealer-cards");

function fetchJSONData() {
  fetch("../blackjack/data/cardList.json")
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(jsonData => {
      // Iterate through the items in the array and append them to the new array
      jsonData.forEach(item => {
        cards.push(item);
      });
      shuffleDeck();
      dealCards();
      startGame();
    })
    .catch(error => {
        console.error('Error fetching the JSON file:', error);
    });
}
fetchJSONData();

function shuffleDeck() {
  let cur = cards.length;
  let random, temp;

  while (cur !== 0) {
    // get random number from 1 to value of cur
    random = Math.floor(Math.random() * cur);
    cur -= 1;
    // save temp to the correspsonsponding value of cur index
    temp = cards[cur];
    // cur index element and random index element switches spots
    cards[cur] = cards[random];
    cards[random] = temp;
  }
}

function dealCards() {
  dealerSum = draw(dealerCards, dealerSum);
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  document.querySelector(".dealer-sum").textContent = dealerSum;

  playerSum = draw(playerCards, playerSum);
  playerSum = draw(playerCards, playerSum);
  playerSum = reduceAce(playerSum, playerAceCount);
  document.querySelector(".player-sum").textContent = playerSum;
}


function startGame() {
  
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
  document.getElementById("restart").addEventListener("click", restart);
}

function hit() {
  if (!hittable) {
      checkResult();
      return
  } else {
    playerSum = draw(playerCards, playerSum);
    reduceAce(playerSum, playerAceCount);
    document.querySelector(".player-sum").textContent = playerSum;
    if (playerSum >= 21) {
      hittable = false;
      checkResult();
    }
}
}

function stay() {
  hittable = false;
  checkResult();
}

function checkResult() {

  let message = "";
  if (playerSum > 21) {
    message = "You Lose!";
  } else {
      dealerDraw();
      if (dealerSum > 21) {
        message = "You win!";
      }
      //both you and dealer <= 21
      else if (playerSum == dealerSum) {
          message = "Tie!";
      }
      else if (playerSum > dealerSum) {
          message = "You Win!";
      }
      else if (playerSum < dealerSum) {
          message = "You Lose!";
      }
  } 

  document.querySelector(".dealer-sum").innerText = dealerSum;
  document.querySelector(".player-sum").innerText = playerSum;
  document.querySelector(".results").innerText = message;
}

function dealerDraw() {
  while (dealerSum < 17) {
    dealerSum = draw(dealerCards, dealerSum);
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    document.querySelector(".dealer-sum").textContent = dealerSum;
  }
}

function draw(deck, sum) {
  let card = cards.pop();
  const newCard = document.createElement("div");
  newCard.classList.add("card");
  newCard.setAttribute("name", card.name);
  // back ticks allow for "" and '' and javascript variables
  newCard.innerHTML = `
    <div class="card-front">
      <div class="front">
        <img class="blackjack-front-image" src=${card.image}>
      </div>
    </div>
    <div class="card-back">
      <div class="back"></div>
    </div>
  `;
  // place each card within the grid container
  deck.appendChild(newCard);
  setTimeout(() => {newCard.classList.add("flipped")}, 1000);
  sum += getValue(card);
  return sum;
}

function getValue(card) {
  let value = card.name.split("-")[0];

  if (isNaN(value)) { //A J Q K
    if (value == "A") {
      playerAceCount += 1;
      return 11;
    }
    return 10;
  }
  return parseInt(value);
}

function reduceAce(sum, aceCount) {
  while (sum > 21 && aceCount > 0) {
      sum -= 10;
      aceCount -= 1;
  }
  return sum;
}

function restart() {
  document
    .querySelectorAll(".card")
    .forEach((e) => e.parentNode.removeChild(e));
  
  dealerSum = 0;
  playerSum = 0;
  
  dealerAceCount = 0;
  playerAceCount = 0; 
  cards = [];
  hittable = true;
  document.querySelector(".results").innerText = "";
  fetchJSONData();
}

