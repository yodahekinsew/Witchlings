const PATH_TO_QUESTIONS = "/data/questions.json";
const quiz = document.getElementById("quiz");
const takeQuizButton = document.getElementById("take-quiz-button");
const previousQuestionButton = document.getElementById("previous-question");
let houseOrder;
var autoScroll;

takeQuizButton.onclick = () => {
  quiz.style.overflowY = "auto";
  requestAnimationFrame(startQuiz);
};

var currentQuestion = 0;
previousQuestionButton.onclick = () => {
  console.log(quiz.scrollTop, quiz.clientHeight);
  // const currentQuestion = Math.round(quiz.scrollTop / quiz.clientHeight) - 1;
  currentQuestion--;
  // console.log("Which question index are we on?", currentQuestion);
  quiz.scrollTo({
    top: document.getElementById(`question-${currentQuestion}`).offsetTop,
    behavior: "smooth",
  });
};

quiz.addEventListener("scroll", () => {
  if (
    quiz.scrollTop > 1.5 * quiz.clientHeight &&
    quiz.scrollTop < quiz.scrollHeight - 1.5 * quiz.clientHeight
  ) {
    previousQuestionButton.style.pointerEvents = "unset";
    previousQuestionButton.style.opacity = 1;
  } else {
    previousQuestionButton.style.pointerEvents = "none";
    previousQuestionButton.style.opacity = 0;
  }
});

function scrollToPage(index) {}

function generateQuestionsHTML(questions) {
  // Setting up the image question separately
  const imageAnswerFields = document
    .getElementById("question-0")
    .getElementsByClassName("answer");
  for (let i = 0; i < imageAnswerFields.length; i++) {
    let answerField = imageAnswerFields[i];
    answerField.onclick = () => {
      for (let j = 0; j < imageAnswerFields.length; j++) {
        imageAnswerFields[j].classList.remove("selected");
      }
      answerField.classList.add("selected");

      // Go to next question
      currentQuestion = 1;
      clearTimeout(autoScroll);
      const element = document.getElementById(`question-0`);
      autoScroll = setTimeout(() => {
        quiz.scrollTo({
          top: element.offsetHeight + element.offsetTop,
          behavior: "smooth",
        });
      }, 500);
    };
  }

  // Setup the rest of the questions
  const questionTemplate = document.getElementById("question-template");
  questions.forEach((question, questionIndex) => {
    if (question.type == "image") return;
    const questionClone = questionTemplate.content.cloneNode(true);
    questionClone.firstElementChild.id = `question-${questionIndex}`;
    if (question.type == "image")
      questionClone.firstElementChild.classList.add("image-question");
    const questionField = questionClone.firstElementChild.firstElementChild;
    questionField.innerText = question.question;
    const answerFields =
      questionClone.children[0].getElementsByClassName("answer");
    for (let i = 0; i < answerFields.length; i++) {
      let answerField = answerFields[i];
      const text =
        answerField.firstElementChild.firstElementChild.firstElementChild;
      if (question.type == "image") {
        answerField.firstElementChild.firstElementChild.removeChild(text);
        var img = document.createElement("img");
        img.src = question.answers[i].answer;
        img.alt = question.answers[i].alt;
        answerField.firstElementChild.firstElementChild.appendChild(img);
      } else {
        text.innerText = question.answers[i].answer;
      }
      answerField.onclick = () => {
        for (let j = 0; j < answerFields.length; j++) {
          answerFields[j].classList.remove("selected");
        }
        answerField.classList.add("selected");

        // Go to next question
        currentQuestion = questionIndex + 1;
        clearTimeout(autoScroll);
        const element = document.getElementById(`question-${questionIndex}`);
        autoScroll = setTimeout(() => {
          quiz.scrollTo({
            top: element.offsetHeight + element.offsetTop,
            behavior: "smooth",
          });
        }, 500);
      };
    }
    quiz.appendChild(questionClone);
  });
  quiz.appendChild(quiz.firstElementChild);
  requestAnimationFrame(() => {
    document.getElementById("background").style.height = "0px";
    requestAnimationFrame(() => {
      document.getElementById("background").style.height = `${
        document.getElementById("quiz").scrollHeight
      }px`;
    });
  });
}

/**
 * Getting the quiz information
 */
window.addEventListener("load", () => {
  fetch(PATH_TO_QUESTIONS)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((json) => {
      console.log(json);
      houseOrder = json.houses;
      generateQuestionsHTML(json.questions);
    })
    .catch(function (e) {
      console.log("Error parsing questions JSON: ", e);
      this.dataError = true;
    });
});

/**
 * Handle quiz submission
 */
getResultsButton.onclick = () => {
  // Check if the quiz is filled out, and if it is show the cards
  var filledOut = true;
  let selectedHouses = [];
  const questions = quiz.getElementsByClassName("question");
  // for (let i = 0; i < questions.length; i++) {
  //   const answers = questions[i].getElementsByClassName("answer");
  //   var hasSelectedAnswer = false;
  //   // Iterate through answers to see which one was selected
  //   // (Doing it this way rather than just getting the selected directly,
  //   // so we can see which index, and subsequently which house, was chosen)
  //   for (let j = 0; j < answers.length; j++) {
  //     if (answers[j].classList.contains("selected")) {
  //       hasSelectedAnswer = true;
  //       selectedHouses.push(houseOrder[j]);
  //     }
  //   }
  //   // If a question isn't answered, scroll back up to that question
  //   if (!hasSelectedAnswer) {
  //     filledOut = false;
  //     quiz.scrollTo({
  //       top: document.getElementById(`question-${i}`).offsetTop,
  //       behavior: "smooth",
  //     });
  //     break;
  //   }
  // }

  if (filledOut) getResults(selectedHouses);
};

const startQuiz = () => {
  // Clear selected answers when starting the quiz
  const questions = quiz.getElementsByClassName("question");
  for (let i = 0; i < questions.length; i++) {
    const answers = questions[i].getElementsByClassName("answer");
    for (let j = 0; j < answers.length; j++)
      answers[j].classList.remove("selected");
  }

  quiz.scrollTo({
    top: quiz.clientHeight,
    behavior: "smooth",
  });
};
