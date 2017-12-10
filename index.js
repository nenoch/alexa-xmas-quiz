const Alexa = require('alexa-sdk');
const quiz = require('./quiz.const');


const APP_ID = 'amzn1.ask.skill.10704661-df0b-423e-ad5e-f071318ddc00';

const SKILL_NAME = 'Xmas Quiz';
const startOutput = `Hi! Let's play. I am going to share 3 christmas facts and you will have to guess whether they're true or false.
Say "play" when you are ready`;
const startReprompt = "Hey, are you still there? If you want to play say play.";
const answerPrompt = " Is it True or False?";
const helpOutput = `I am here to help! I am going to share 5 christmas facts and you will have to guess whether they're true or false.
Say "play" if you are ready.`;
const helpReprompt = `Remember, you can say play and we'll start playing`;
const stopOutput = 'Goodbye, Thanks for playing!';


exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var currentQuiz;
var currentAnswer;
var counter = [];

const handlers = {
    'LaunchRequest': function () {
        this.emit(":ask", startOutput, startReprompt);
    },
    'StartQuiz': function () {
        const quizIndex = Math.floor(Math.random() * quiz.length);
        currentQuiz = quiz[quizIndex];
        const speechOutput = currentQuiz.text + answerPrompt;
        this.emit(':ask', speechOutput);
    },
    'PlayQuiz': function () {
        let reply;
        if (currentQuiz.answer === currentAnswer) {
            reply = "That's right, well done!";
            counter.push(1);
        } else {
            reply = "I am afraid that's not correct!";
            counter.push(0);            
        }
        if (counter.length == 3) {
            this.emit('EndQuiz');
        } else {
            const quizIndex = Math.floor(Math.random() * quiz.length);
            currentQuiz = quiz[quizIndex];
            const next = " Here's another fact: ";
            const speechOutput = reply + next + currentQuiz.text + answerPrompt;
            this.emit(':ask', speechOutput);
        }
    },
    'EndQuiz': function () {
        let score = counter.reduce((a, b) => a + b);
        const speechOutput = score >= 2 ? "You won! Oh Oh Oh you're the Christmas Champion" : "This time you lose, some more pudding?";
        const playAgain = " Would you like to start another match? Say play and we'll play again!";
        this.emit(':ask', speechOutput + playAgain);
    },
    'TrueIntent': function () {
        currentAnswer = true;
        this.emit('PlayQuiz');
    },
    'FalseIntent': function () {
        currentAnswer = false;
        this.emit('PlayQuiz');
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
};