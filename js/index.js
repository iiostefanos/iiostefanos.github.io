/*jslint devel: true */

//Variables

var showPatternInterval;
var currentPattern = [];
var currentLevel = 1;
var playerClickNumber = 0;
var notificationsEnabled = false;
var strictEnabled = false;


// initialize all tooltips 
$('[data-toggle="tooltip"]').tooltip({
    boundary: 'window'
});

// Making use of jQuery variables like buttons, sides, modals, score and message(s) are targetted.
const score$ = $("#score"); 
const sides$ = $(".side");
const winModal$ = $('#winModal');
const winModalDisplay$ = $('#win-modal-display');
const loseModal$ = $('#loseModal');
const loseModalScore$ = $("#lose-modal-score");
const levelModal$ = $("#levelModal");
const levelModalTitle$ = $("#level-modal-title");
const levelModalContent$ = $("#level-modal-content");
const levelMessages = [ {
    title:"Level 1",
    message:"Don't be to harsh on yourself. You've just started"
}, {
    title:"Level 2",
    message:"Roses are red, violets are blue... You have just went past level two"
}, {
    title:"Level 3",
    message: "Stick with it. Nearly there !"
}, {
    title:"Level 4",
    message:"Not failed. Just  another 16 levels more"
}, {
    title:"Level 5",
    message:"By the way, did you read the rules ?!?"
}, {
    title:"Level 6",
    message:"It's not that hard. Just focus more!"
}, {
    title:"Level 7",
    message:"You are doing just fine,... for now !"
}, {
    title:"Level 8",
    message:'You are doing just fine,... for now !'
}, {
    title:"Level 9",
    message:"Nein or nine? Nein means 'No', but you get a 'Yes!'"
}, {
    title:"Level 10",
    message:"Oh, 10 more levels and you actually will win !"
}, {
    title:"Level 11",
    message:"Seven-Eleven and you'll get even."
}, {
    title:"Level 12",
    message:"One step at a time. There's no rush!"
}, {
    title:"Level 13",
    message:"If you got 'til here, you should try more."
}, {
    title:"Level 14",
    message:"Do not be discouraged if you fail a few times."
}, {
    title:"Level 15",
    message:"Change the way you look at things and the things you look at change."
    
}, {
    title:"Level 16",
    message:"Luck is what you have left over after you give 100%." 
}, {
     title:"Level 17",
    message:"Some days you’re up. Some days you’re down."
}, {
     title:"Level 18",
    message:"It takes less time to do things right than to explain why you did it wrong."
}, {
     title:"Level 19",
    message:"Get up, get up, get up!!! Happiness is not the absence of problems, it’s the ability to deal with them."
} ]

/* A Click function that has assigned the action of starting the game whenever the 'PLAY' button is pressed. */


$('[action="start"]').click(function () {
    startGame();
});

/* A Click function for the 'Okay' button. */

$('#level-message-ok').click(function () {
    nextLevel();
});

/* Allows the player to choose if after each level completed will receive a message/quote. */

$("#enableNotifications").on("click", function () {
    notificationsEnabled = $(this).is(':checked');
});


/* This function verifies if STRICT Mode is enabled */

$("#enableStrict").on("click", function () {
    strictEnabled = $(this).is(':checked');
});



/* Here it is verified which side is clicked and highlighted */

function onSideClick(side) {
    if ($(`.${side}-side`).hasClass('disabled')) {
        return;
    }

    highlightSide(side, 700);
    playerClickNumber++;
    checkSide(side);
}

/* This function will clear the lighs on all sides in a time interval of 400 milliseconds. */

function clearLights(time) {
    if (time === null) {
        time = 400;
    } 
    
    setTimeout(function () {
        sides$.removeClass('light');
    }, time);
}

/* Sound for each side is played with the help of this function. */

function playSound(side) {
    if (!side) {
        return;
    }

    let sound = $(`#sound-${side}`)[0];

    sound.currentTime = 0;
    sound.play();
}


/* Each side will be highlighted and having its own specific sound. */

function highlightSide(side, time) {
    $(`.${side}-side`).addClass('light');
    playSound(side);
    clearLights(400);
}

/* This function has the role to allow the player to start a new game.  */

function initializeGame() {
    clearInterval(showPatternInterval);
    clearLights();
    updateScore(0);
    currentLevel = 1;
    currentPattern = [];
    playerClickNumber = 0;
}


/* 
Here, it takes place a random number from 1 (one) to 4 (four) and after that the number will be pushed into the instance array.
It runs the player's interval which will keep a switch statement that will verify each of the number inside the instance array, generating the sound and light that corresponds to the number found and doing a break after each one, that way will be able o avoid the light and sound from the previous side that was selected. It will do this until it will reach the number value of the computer's count.*/

function generatePattern(level) {
    var side = null;

    var number = Math.ceil(Math.random() * 4);

    switch (number) {
        case 1:
            side = 'green';
            break;
        case 2:
            side = 'red';
            break;
        case 3:
            side = 'yellow';
            break;
        case 4:
            side = 'blue';
            break;
        default:
            break;
    }

    currentPattern.push(side);
}

// shows the player the pattern needed to be followed/played

function showPattern() {
    if (!currentPattern || !currentPattern.length) return;

    var stepIndex = 0;

    disableSides();

    showPatternInterval = setInterval(function () {

        highlightSide(currentPattern[stepIndex]);


        if (currentPattern.length === stepIndex) {
            clearInterval(showPatternInterval);
            enableSides();
        }

        stepIndex++;
    }, 800);
}


/* The game starts after the pattern has been generated and then shown.*/

function startGame() {
    initializeGame();
    generatePattern();
    showPattern();
}

/* Here is verified if the player clicks the same instance as shown and either the 'STRICT' mode and 'Message' mode is activated. */

function checkSide(actual) {
    var required = currentPattern[playerClickNumber - 1];

    if (actual !== required && strictEnabled)  {
        gameOver();
        return;  
    }
    
    if (actual !== required && !strictEnabled)  {
        playerClickNumber = 0;
        playSound('lost');
        updateScore('Try');
        showPattern();
        return;
    }
    
    if (playerClickNumber === currentPattern.length) {
        if (notificationsEnabled) {
            var notification = levelMessages[currentLevel - 1];
            levelModalTitle$.text(notification.title)
            levelModalContent$.text(notification.message)
            levelModal$.modal('show');
    
        } else {
            nextLevel(700);
        }

    }
}

/* This function checks at which level the player is, if on level 20 then there's the WINNER, if not will go to next level, updateing the score after each one.*/

function nextLevel(time) {
    if(currentLevel === 20) {
       return gameWin();
    }
    updateScore(currentLevel);
    disableSides();
    currentLevel++;
    playerClickNumber = 0;

    setTimeout(function () {
        generatePattern();
        showPattern();
    }, time);
}


/* This function is when the player has lost, will be informed with a modal, score will be displayed together with a specific sound. */

function gameOver() {
    loseModalScore$.text(currentLevel - 1);
    loseModal$.modal('show');
    playSound('lost');
    updateScore(0);
}

/* When the player wins the Simon Game, this function will display the Winning Modal and the sample sound for winning can be heard.. */

function gameWin() {
    winModalDisplay$.text(currentLevel);
    winModal$.modal('show');
    playSound('win');
}


/* This function will disable the light on all sides. */

function disableSides() {
    sides$.addClass('disabled');
}

/* This function will enable the light on all sides. */
function enableSides() {
    sides$.removeClass('disabled');
}

/* The score will be updated using this function. */
function updateScore(score) {
    score$.text(score);
}
