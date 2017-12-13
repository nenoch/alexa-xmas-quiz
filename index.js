const Alexa = require('alexa-sdk');
const quiz = require("./quiz.const");


const APP_ID = "amzn1.ask.skill.10704661-df0b-423e-ad5e-f071318ddc00";

const SKILL_NAME = "Xmas Quiz";
const startOutput = `Hi! Let's play. I am going to share 3 christmas facts. You will have to guess if they're true or false.
Say 'play' when you are ready`;
const startReprompt = "If you want to play say play.";
const playAgain = " Would you like to start another match? Say play and we'll play again!";
const wonMessage = `You won!<say-as interpret-as="interjection">Oh Oh Oh</say-as>you're the Christmas Champion.`;
const lostMessage = "I am afraid you've lost this time, the perfect excuse for some more pudding!";
const answerPrompt = " Is it true or false?";
const answerReprompt = "If you'd like me to repeat, say repeat.";
const helpOutput = `I am here to help! I will share 3 christmas facts for you to guess if they're true or false.
Say 'play' if you'd like to play.`;
const helpReprompt = `Remember, you can say play and we'll start playing`;
const stopOutput = 'Goodbye, Thanks for playing!';


exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var currentQuiz;
var currentFact;
var currentAnswer;
var counter = [];

const handlers = {
    'LaunchRequest': function () {
        this.event.response.sessionAttributes.hello = "works";
        this.emit(":ask", startOutput, startReprompt);
    },
    'StartQuiz': function () {
        currentQuiz = quiz.slice();
        getFact.call(this);        
        const speechOutput = currentFact.text + answerPrompt;
        this.emit(':ask', speechOutput, answerReprompt);
    },
    'PlayQuiz': function () {
        let reply;

        if (currentFact === undefined) {
            this.emit('LaunchRequest');
        } else if (currentFact.answer === currentAnswer) {
            counter.push(1);
            reply = "That's right, well done!";
        } else {
            counter.push(0);
            reply = "I am afraid that's not correct!";
        }

        if (counter.length == 3) {
            this.emit('EndQuiz');
        } else {
            getFact.call(this);
            const next = " Here's another fact: ";
            const speechOutput = reply + next + currentFact.text + answerPrompt;
            this.emit(':ask', speechOutput);
        }
    },
    'EndQuiz': function () {
        let score = counter.reduce((a, b) => a + b);
        let endOutput = `This last one was ${currentFact.answer}. Your total score is ${score} out of three`;
        const speechOutput = score >= 2 ? wonMessage : lostMessage;
        this.emit(':ask', endOutput + speechOutput + playAgain);
    },
    'TrueIntent': function () {
        currentAnswer = true;
        this.emit('PlayQuiz');
    },
    'FalseIntent': function () {
        currentAnswer = false;
        this.emit('PlayQuiz');
    },
    'RepeatIntent': function () {
        const speechOutput = currentFact.text + answerPrompt;
        this.emit(':ask', speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpOutput, helpReprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', stopOutput);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', stopOutput);
    },
    'SessionEndedRequest': function() {
        this.emit(':tell', "Sorry, I didn't get that");
    }
};

function getFact(){
    let quizIndex = Math.floor(Math.random() * currentQuiz.length);
    currentFact = currentQuiz[quizIndex];
    currentQuiz.splice(quizIndex, 1);
}