// https://opentdb.com/api.php?amount=10

const questionRef = document.querySelector('#question');
const optionsRef = document.querySelector('#options');
const btnCategoryRef = Array.from(document.querySelectorAll(".btn-categories"))
const btnCheckAnswer = document.querySelector('#check-answer');
const btnPlayAgain = document.querySelector('#play-again');
const correctScoreRef = document.querySelector('#correct-score');
const totalQuestionRef = document.querySelector('#total-question');
const resultsref = document.querySelector('#result');

const gameSectionRef = document.querySelector('#game')
const indexSectionRef = document.querySelector('#index')


let catNumber = 0
let correctAnswer = "",
    score = 0,
    questionCounter = 0,
    totalQuestion = 10;


function eventListeners() {
    btnCheckAnswer.addEventListener('click', checkAnswer);
    btnPlayAgain.addEventListener('click', restartQuiz);
}

async function loadQuestion(categoryID) {
    const APIUrl = `https://opentdb.com/api.php?amount=1&category=${categoryID}`
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();
    resultsref.innerHTML = "";
    showQuestion(data.results[0]);
}


document.addEventListener('DOMContentLoaded', function () {
    loadQuestion();
    eventListeners();
    totalQuestionRef.textContent = totalQuestion;
    totalQuestionRef.textContent = score;
});

/**
 * Select the questions by categories
 **/
btnCategoryRef.forEach(btn => {
    btn.addEventListener("click", (event) => {
        switch (event.target.id) {
            case "films":
                catNumber = 11
                loadQuestion(catNumber)
                break;
            case "animals":
                catNumber = 27
                loadQuestion(catNumber)
                break;
            case "cars":
                catNumber = 28
                loadQuestion(catNumber)
                break;
            case "sports":
                catNumber = 21
                loadQuestion(catNumber)
                break;
            default:
                break;
        }


        gameSectionRef.classList.add("show")
        gameSectionRef.classList.remove("hidden")
        indexSectionRef.classList.add("hidden")
        indexSectionRef.classList.remove("show")
    })
})



/**
 * Display questions and answers 
 */
function showQuestion(data) {
    btnCheckAnswer.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);

    questionRef.innerHTML = `${data.question} <br> <span class = ".btn-categories"> ${data.category} </span>`;
    optionsRef.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}

/**
 * Select answer
 */
function selectOption() {
    optionsRef.querySelectorAll('li').forEach(function (option) {
        option.addEventListener('click', function () {
            if (optionsRef.querySelector('.selected')) {
                const activeOption = optionsRef.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
    console.log(correctAnswer);
}
/**
 * Check the correct or incorrect answer
 */
function checkAnswer() {
    // questionCounter++;
    btnCheckAnswer.disabled = true;
    if (optionsRef.querySelector('.selected')) {
        let selectedAnswer = optionsRef.querySelector('.selected span').textContent;
        if (selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
            score++;
            resultsref.innerHTML = `<p><i class = "fas fa-check"></i>Correct 
            Answer!</p>`;
        } else {
            resultsref.innerHTML = `<p><i class = "fas fa-times">
            </i>Incorrect Answer!</p> <small><b>Correct Answer: 
            </b>${correctAnswer}</small>`;
        }
        checkCounter();
    } else {
        resultsref.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option! </p>`
        btnCheckAnswer.disabled = false;
    }
    
    }

/**
 * Convert html entities into normal text of correct answer if there is any
 */
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

/**
 * Get new question
 */
function checkCounter() {
    questionCounter++;
    setCounter();
    if (questionCounter == totalQuestion) {
       resultsref.innerHTML = `<p> Your score is ${score}</p>`;
       btnPlayAgain.style.display = "block";
       btnCheckAnswer.style.display = "none";
    } else {
        setTimeout(() => {
            loadQuestion(catNumber); 
        }, 300);
    }
}

function setCounter() {
    totalQuestionRef.textContent = totalQuestion;
    correctScoreRef.textContent = score;
}

/**
 * Restarts the score and the game
 */
function restartQuiz() {
    score = questionCounter = 0;
    btnPlayAgain.style.display = "none";
    btnCheckAnswer.style.display = "block";
    btnCheckAnswer.disabled = false;
    setCounter();
    loadQuestion(catNumber);

    gameSectionRef.classList.add("hidden")
    gameSectionRef.classList.remove("show")
    indexSectionRef.classList.remove("hidden")
}


