const PATH_TO_HOUSES = "/data/houses.json";
const resultsPage = document.getElementById("results-page");
const yourCovenField = document.getElementById("your-coven");
const covenChoiceField = document.getElementById("coven-choice");
const houseDescriptionField = document.getElementById("house-description");
const houseCards = document.getElementById("cards-holder");
const postQuizButtons = document.getElementById("post-quiz-buttons");
const retakeQuizButton = document.getElementById("retake-quiz-button");
const preorderBookButton = document.getElementById("preorder-book-button");
let allHousesInfo;

const setCardsHolderTop = () => {
  // The cards should be place at a minimum of 75px from the "your-coven" field
  // but ideally they should be centered in the remaining portion of the screen if
  // there's more room to move down
  const minimumTop =
    yourCovenField.offsetHeight + (0 * window.innerHeight) / 100;
  const remainingHeight = window.innerHeight - yourCovenField.offsetHeight;
  const idealTop =
    yourCovenField.offsetHeight +
    remainingHeight / 2 -
    cardsHolder.scrollHeight;
  console.log(
    idealTop,
    minimumTop,
    yourCovenField.offsetHeight,
    window.innerHeight,
    cardsHolder.scrollHeight
  );

  // cardsHolder.style.top = `${Math.max(idealTop, minimumTop)}px`;
  cardsHolder.style.top = `${minimumTop}px`;
};

function displayResults(houseResult) {
  const houseInfo = allHousesInfo[houseResult];

  // Change the house name
  covenChoiceField.innerText = houseResult;

  // Fill out the house description
  for (let i = 0; i < houseInfo.description.length; i++) {
    houseDescriptionField.children[i].innerText = houseInfo.description[i];
  }
  for (let i = houseInfo.description.length; i < 3; i++) {
    houseDescriptionField.children[i].innerText = "";
  }

  // Update the house cards (in reverse order)
  houseCards.children[6].firstElementChild.src = houseInfo.crest;
  houseCards.children[5].firstElementChild.src = houseInfo.motto;
  houseCards.children[4].firstElementChild.src = houseInfo.details;
  houseCards.children[3].firstElementChild.src = houseInfo.strength;
  houseCards.children[2].firstElementChild.src = houseInfo.weakness;
  houseCards.children[1].firstElementChild.src = houseInfo.profession;
  houseCards.children[0].firstElementChild.src = houseInfo.fun;

  // RESULTS REVEAL ANIMATION
  // 1 --> fade in results page over quiz page
  resultsPage.style.display = "unset";
  resultsPage.scrollTo(0, 0);
  // yourCovenField.style.transform = "translate(-50%, -50%)";
  yourCovenField.style.top = "50%";
  requestAnimationFrame(() => {
    resultsPage.style.opacity = 1;
  });
  setCardsHolderTop();

  // 2 --> fade in "Your coven is... " loading text
  // Should be done automatically
  const yourCovenTexts =
    yourCovenField.firstElementChild.getElementsByClassName("fade-reveal");
  setTimeout(() => {
    yourCovenTexts[0].style.opacity = 1;
  }, 1000);
  for (let i = 1; i < yourCovenTexts.length; i++) {
    setTimeout(() => {
      yourCovenTexts[i].style.opacity = 1;
    }, 2000 + 125 * i);
  }

  // 3 --> fade in coven choice
  setTimeout(() => {
    covenChoiceField.style.opacity = 1;
  }, 4000);

  // 4 --> fade away "Your coven is..."
  setTimeout(() => {
    for (let i = 0; i < yourCovenTexts.length; i++) {
      yourCovenTexts[i].style.opacity = 0;
    }
  }, 5000);

  // 5 --> move coven name to top of screen
  setTimeout(() => {
    // yourCovenField.style.transform = "translate(-50%, -500%)";
    // yourCovenField.style.transform = "translate(0, 0%)";
    yourCovenField.style.top = "0%";
  }, 5500);

  // 6 --> fade in coven description
  setTimeout(() => {
    houseDescriptionField.style.opacity = 1;
  }, 5500); // 6500

  // 7 --> fade in "learn more about your coven" and the cards
  setTimeout(() => {
    showCards();
    setTimeout(() => {
      enableCards();
    }, 2000);
  }, 7500);

  // 8 --> fade in buttons (take quiz again, share results) and links (to preorder book)
  setTimeout(() => {
    postQuizButtons.style.opacity = 1;
    setTimeout(() => {
      retakeQuizButton.style.pointerEvents = "all";
      preorderBookButton.style.pointerEvents = "all";
    }, 500);
  }, 9500);
}

window.addEventListener("resize", () => {
  setCardsHolderTop();
});

function getResults(selectedHouses) {
  const houseCounts = {};
  selectedHouses.forEach((house) => {
    if (houseCounts[house]) {
      houseCounts[house]++;
    } else {
      houseCounts[house] = 1;
    }
  });

  var houseResult = selectedHouses[0];
  var maxCount = 0;
  for (const house in houseCounts) {
    const count = houseCounts[house];
    if (count > maxCount) {
      houseResult = house;
      maxCount = count;
    }
  }

  displayResults("House Hyacinth");
  // displayResults(houseResult);
}

/**
 * Getting the house information
 */
window.addEventListener("load", () => {
  fetch(PATH_TO_HOUSES)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((json) => {
      allHousesInfo = json;
    })
    .catch(function (e) {
      console.log("Error parsing questions JSON: ", e);
      this.dataError = true;
    });
});

/**
 * Setting up the post quiz buttons
 */
retakeQuizButton.onclick = () => {
  disableCards();
  startQuiz(); // scrolls quiz to start

  covenChoiceField.style.opacity = 0;

  houseDescriptionField.style.opacity = 0;

  postQuizButtons.style.opacity = 0;
  retakeQuizButton.style.pointerEvents = "none";
  preorderBookButton.style.pointerEvents = "none";

  hideCards();

  setTimeout(() => {
    resultsPage.style.opacity = 0;
    setTimeout(() => {
      resultsPage.style.display = "none";
    }, 500);
  }, 3000);
};
preorderBookButton.onclick = (event) => {
  if (!event) event = window.event;
  console.log(event);
  if (event.stopPropogation) event.stopPropogation();
  else event.cancelBubble = true;
  console.log(event);
  window.open("https://www.claribelortega.com/witchlings", "_blank");
};
