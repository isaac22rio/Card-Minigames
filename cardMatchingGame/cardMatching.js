const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

document.querySelector(".score").textContent = score;


function fetchJSONData() {
  fetch("../cardMatchingGame/data/cardList.json")
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(jsonData => {
      // Iterate through the items in the array and append them to the new array
      jsonData.forEach(item => {
        // append twice so that there are two of each card
        cards.push(item);
        cards.push(item);
      });

      shuffleDeck();
      dealCards();
    })
    .catch(error => {
        console.error('Error fetching the JSON file:', error);
    });
}
fetchJSONData();


// Fisher Yates Alg
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
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("name", card.name);
    // back ticks allow for "" and '' and javascript variables
    cardElement.innerHTML = `
      <div class="card-front">
        <div class="front">
          <img class="cardMatching-front-image" src=${card.image}>
        </div>
      </div>
      <div class="card-back">
        <div class="back"></div>
      </div>
    `;
    // place each card within the grid container
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  // if the clikced card was already flipped in the turn, return
  if (this === firstCard) return;

  this.classList.add("flipped");

  // if firstCard is false, clicked card becomes first card
  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkPair();
}

function checkPair() {
  let isMatch = firstCard.getAttribute("name") === secondCard.getAttribute("name");
  // if isMatch is true run disableCards() and unflip() if false
  isMatch ? disableCards() : unflip();
}

function disableCards() {
  // make the object unable to be clicked by removing event listeners
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  score++;
  document.querySelector(".score").textContent = score;
  resetBoard();
}

function unflip() {
  // delays function call for animation to finish
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restartGame() {
  resetBoard();
  shuffleDeck();
  score = 0;
  document.querySelector(".score").textContent = score;
  // empty the grid container
  gridContainer.innerHTML = "";
  dealCards();
}    