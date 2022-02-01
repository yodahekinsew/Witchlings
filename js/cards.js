const getResultsButton = document.getElementById("results-button");
const cardsPage = document.getElementById("cards-page");
const cardsHolder = document.getElementById("cards-holder");
const cards = document.getElementsByClassName("card");

/**
 * Adding CSS for the cards
 * (would be too annoying to do myself)
 */
const numCards = 7;

165 / 1533;

const idleAngleRange = { min: -30, max: 30 };
const hoverAngleRange = { min: -20, max: 20 };
const activeAngleRange = { min: -10, max: 10 };
const idleTranslateXRange = { min: -20, max: 20 };
const activeTranslateXRange = { min: -25, max: 25 };
const idleTranslateYRange = { min: 4.5, max: 10 };
// const idleTranslateYRange = { min: 65, max: 165 };
const hoverTranslateYRange = { min: 2, max: 7.5 };
const activeTranslateYRange = { min: 0, max: 5 };
const lerpRange = (range, interpolant) => {
  return interpolant * (range.max - range.min) + range.min;
};

var showingAllCards = false;
var addedCSS = [];
const addCSS = (s) => {
  let newCSS = document.head.appendChild(document.createElement("style"));
  newCSS.innerHTML = s;
  addedCSS.push(newCSS);
};
const removeAddedCSS = () => {
  addedCSS.forEach((css) => document.head.removeChild(css));
  addedCSS = [];
};
const addExtraCSS = () => {
  for (let i = 0; i < numCards; i++) {
    const childIndex = numCards - i;
    // const childIndex = i + 1;

    const interpolant = i / (numCards - 1);
    const idleAngle = lerpRange(idleAngleRange, interpolant);
    const hoverAngle = lerpRange(hoverAngleRange, interpolant);
    const activeAngle = lerpRange(activeAngleRange, interpolant);
    const idleTranslateX = lerpRange(idleTranslateXRange, interpolant);
    const activeTranslateX = lerpRange(activeTranslateXRange, interpolant);

    const inverseInterpolant = Math.pow(
      Math.abs(i - (numCards - 1) / 2) / ((numCards - 1) / 2),
      2
    );
    const idleTranslateY = lerpRange(idleTranslateYRange, inverseInterpolant);
    const hoverTranslateY = lerpRange(hoverTranslateYRange, inverseInterpolant);
    const activeTranslateY = lerpRange(
      activeTranslateYRange,
      inverseInterpolant
    );
    addCSS(
      `.card:nth-child(${childIndex}) {
        transition-delay: ${0.125 * i}s;
         transform: rotateZ(${5 * Math.random()}deg);
     }`
    );
    addCSS(
      `.show-card.card:nth-child(${childIndex}) {
         transition-delay: 0s;
         transform: translate(${idleTranslateX}vw, ${idleTranslateY}vw) 
            rotateZ(${idleAngle}deg) ;
     }`
    );
    addCSS(
      `.show-card.card:nth-child(${childIndex}):hover {
         transition: transform 0.5s ease;
         transform: translate(${activeTranslateX}vw, ${hoverTranslateY}vw) rotateZ(${hoverAngle}deg) scale(1.15);
     }`
    );
    addCSS(
      `.show-card.card:nth-child(${childIndex}):active {
         transform: translate(${idleTranslateX}vw, ${activeTranslateY}vw) rotateZ(${activeAngle}deg) scale(1.25); 
     }`
    );
  }

  const unselectedTranslateLeftXRange = {
    idle: { min: -32.5, max: -17.5 },
    hover: { min: -35, max: -20 },
    active: { min: -32.5, max: -17.5 },
  };
  const unselectedTranslateRightXRange = {
    idle: { min: 17.5, max: 32.5 },
    hover: { min: 20, max: 35 },
    active: { min: 17.5, max: 32.5 },
  };
  const unselectedTranslateYRange = {
    idle: { min: 6.5, max: 13 },
    hover: { min: 3, max: 9.7 },
    active: { min: 0, max: 6.5 },
  };
  // const unselectedTranslateYRange = {
  //   idle: { min: 100, max: 200 },
  //   hover: { min: 50, max: 150 },
  //   active: { min: 0, max: 100 },
  // };
  const unselectedAngleRange = {
    idle: { min: -30, max: 30 },
    hover: { min: -20, max: 20 },
    active: { min: -10, max: 10 },
  };
  const halfCount = (numCards - 1) / 2;
  const halfCountCeil = Math.ceil(halfCount);
  for (let i = 0; i < numCards - 1; i++) {
    const childIndex = numCards - 1 - i;
    // const childIndex = i + 1;
    const translateXRange =
      i < halfCount
        ? unselectedTranslateLeftXRange
        : unselectedTranslateRightXRange;
    const translateXInterpolant =
      i < halfCount
        ? i / (halfCountCeil - 1)
        : (i - halfCountCeil) / (halfCountCeil - 1);
    const unselectedIdleTranslateX = lerpRange(
      translateXRange.idle,
      translateXInterpolant
    );
    const unselectedHoverTranslateX = lerpRange(
      translateXRange.hover,
      translateXInterpolant
    );
    const unselectedActiveTranslateX = lerpRange(
      translateXRange.active,
      translateXInterpolant
    );

    const translateYInterpolant = Math.pow(
      Math.abs(i - (numCards - 2) / 2) / ((numCards - 2) / 2),
      2
    );
    const unselectedIdleTranslateY = lerpRange(
      unselectedTranslateYRange.idle,
      translateYInterpolant
    );
    const unselectedHoverTranslateY = lerpRange(
      unselectedTranslateYRange.hover,
      translateYInterpolant
    );
    const unselectedActiveTranslateY = lerpRange(
      unselectedTranslateYRange.active,
      translateYInterpolant
    );

    const angleInterpolant = i / (numCards - 2);
    const unselectedIdleAngle = lerpRange(
      unselectedAngleRange.idle,
      angleInterpolant
    );
    const unselectedHoverAngle = lerpRange(
      unselectedAngleRange.hover,
      angleInterpolant
    );
    const unselectedActiveAngle = lerpRange(
      unselectedAngleRange.active,
      angleInterpolant
    );
    addCSS(
      `.unselected-${childIndex}.show-card.card {
         transition-delay: 0s;
         transform: translate(${unselectedIdleTranslateX}vw, ${unselectedIdleTranslateY}vw) 
             rotateZ(${unselectedIdleAngle}deg);
     }`
    );
    addCSS(
      `.unselected-${childIndex}.show-card.card:hover {
         transform: translate(${unselectedHoverTranslateX}vw, 
                ${unselectedHoverTranslateY}vw) 
            rotateZ(${unselectedHoverAngle}deg) 
            scale(1.15) !important; 
     }`
    );
    addCSS(
      `.unselected-${childIndex}.show-card.card:active {
         transform: translate(${unselectedActiveTranslateX}vw, 
                ${unselectedActiveTranslateY}vw) 
            rotateZ(${unselectedActiveAngle}deg) 
            scale(1.25); 
     }`
    );
  }
};

function mediaHandler(x) {
  if (x.matches) {
    addExtraCSS();
  } else {
    removeAddedCSS();
  }
}
var checkWidth = window.matchMedia("(min-width: 992px)");
mediaHandler(checkWidth);
checkWidth.addListener(mediaHandler);

/**
 * Once the window loads, add functions to the card elements
 */
var currentSelectedCard;
var mapping = {};
const clearMapping = () => {
  for (let i = 0; i < cards.length; i++) {
    if (mapping.hasOwnProperty(i))
      cards[i].classList.remove(`unselected-${mapping[i]}`);
  }
};
window.addEventListener("load", (event) => {
  // Click anywhere outside of the cards to deselect the current card
  document.getElementById("results-page").onclick = () => {
    if (currentSelectedCard) currentSelectedCard.classList.remove("selected");
    currentSelectedCard = null;
    clearMapping();
  };

  // Add hover and click support for the cards
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentSelectedCard) currentSelectedCard.classList.remove("selected");
      clearMapping();
      var index = 0;
      for (let j = 0; j < cards.length; j++) {
        if (i != j) {
          cards[j].classList.add(`unselected-${index + 1}`);
          mapping[j] = index + 1;
          index++;
        }
      }
      cards[i].classList.add("selected");
      currentSelectedCard = cards[i];
    });
  }
});

/**
 * Update the cards positions on resize
 */
window.addEventListener("resize", (event) => {
  console.log("resizing --> should update cards");
});

/**
 * Animate the selected card
 */
window.onmousemove = (e) => {
  const mouseX = 2 * (e.clientX / window.innerWidth - 0.5);
  const mouseY = -2 * (e.clientY / window.innerHeight - 0.5);

  // Animate the lighting on the card
  const intensity = Math.sqrt(Math.pow(mouseX, 2) + Math.pow(mouseY, 2)) / 1.5;
  document.documentElement.style.setProperty(
    "--card-lighting",
    `radial-gradient(farthest-corner at 
         ${(e.clientX / window.innerWidth) * 150}px
         ${(e.clientY / window.innerHeight) * 250}px,
         rgba(255, 255, 255, ${0.4 - intensity * 0.4}) 0%, 
         rgba(255, 255, 255, ${0.4 - intensity * 0.4}) 2.5%, 
         rgba(255, 255, 255, ${0.3 - intensity * 0.3}) 7.5%, 
         rgba(255, 255, 255, 0) ${65 - intensity * 65}%)`
  );

  // Animate the rotation on the card
  document.documentElement.style.setProperty(
    "--card-rotation",
    `rotateX(${(e.clientY / window.innerHeight) * 15}deg) 
     rotateY(${-mouseX * 10}deg)`
  );
};

/**
 * Handle showing the cards (when user clicks the 'Get Results' button)
 * This function is used by the #get-results button in quiz.js
 */
const showCards = () => {
  // Request an animation frame here so that the cards page
  // has time to display, if it doesn't a transition won't occur
  for (let card of cards) card.classList.remove("hide-card");
  setTimeout(() => {
    for (let card of cards) card.classList.add("show-card");
  }, 1000);
};

const hideCards = () => {
  // Request an animation frame here so that the cards page
  // has time to display, if it doesn't a transition won't occur
  for (let card of cards) card.classList.remove("show-card");
  setTimeout(() => {
    for (let card of cards) card.classList.add("hide-card");
  }, 1000);
};

const enableCards = () => {
  for (let card of cards) card.style.pointerEvents = "unset";
};

const disableCards = () => {
  for (let card of cards) card.style.pointerEvents = "none";
};
