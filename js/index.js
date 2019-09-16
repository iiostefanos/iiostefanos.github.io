// Variables

let order = [];
let playerOrder = [];
let strictMode = true;
let playInterval, playTimeout, computerCount, playerCount, turn;

// Making use of jQuery variables like buttons, sides, modals, number and message(s) are targetted.

const countText = document.getElementById("turn-screen");
const side = document.getElementsByClassName('side');
const greenSide = document.getElementById("1");
const redSide = document.getElementById("2");
const yellowSide = document.getElementById("3");
const blueSide = document.getElementById("4");
const playButton = document.getElementById("start");
const strictSwitch = document.getElementById("strict");
const modalScroll = document.getElementById('modal-scroll');
const startModal = document.getElementById("start-modal-button");
const startWinModal = document.getElementById("start-modal-win-button");
const loseModalDisplay = document.getElementById("lose-modal-display");
const winModalDisplay = document.getElementById("win-modal-display");

/* 
The jQuery ready method can have inside the code and will start to run as soon as the DOM (Document Object Modal) is ready to execute the JavaScript code.
*/

$(document).ready(function() {

    // Upon click this jQuery function will allow modal scroll icon to scroll down.

    $(modalScroll).on('click', function(e) {
        var linkHref = $(this).attr('href');
        e.preventDefault();
        $('.modal-body').animate({
            scrollTop: $(linkHref).offset().top
        }, 1000);
    });

    /* 
    3 Click functions that have assigned the startButtonClick jQuery function in order to allow the player to play a new game..
    */

    $(playButton).click(function() {
        startGame();
    });

    $(startModal).on("click", function() {
        startGame();
    });

    $(startWinModal).on("click", function() {
        startGame();
    });

    /*
   A function to verify if the STRICT slider is On (true) or Off (false) when it's clicked. If On (true) then it will return to its default setting (ready to start a new game).
    */

    $(strictSwitch).on("click", function() {
        if (strictSwitch.checked == true) {
            strictMode = true;
            turn = 1;
            $(".side").addClass('disabled');
            clearInterval(playInterval);
            if ($(countText).text() == "|") {
                $(countText).text("|");
            }
            else {
                $(countText).text("0");
            }
            setTimeout(function() {
                eraseLightOnAllSides();
            }, 600);
        }
        else {
            strictMode = false;
        }
    });

    /* 
    Clicking on each of the sides, it will push a number into the player's instance array based on which has been clicked.  After that, it will run a light and sound function, based on the color.    */

    $(side).click(function() {
        clearTimeout(playTimeout);
        eraseLightOnAllSides();
        let sideId = $(this).attr('id');
        if (sideId == 1) {
            SoundPlusGreenLight();
            playerOrder.push(parseInt(sideId));
        }
        if (sideId == 2) {
            SoundPlusRedLight();
            playerOrder.push(parseInt(sideId));
        }
        if (sideId == 3) {
            SoundPlusYellowLight();
            playerOrder.push(parseInt(sideId));
        }
        if (sideId == 4) {
            SoundPlusBlueLight();
            playerOrder.push(parseInt(sideId));
        }
        verify();
    });
});

/*
This function has the role to allow the player to start a new game,  setting everything back to default and generating the game's first instance. */

function startGame() {
    clearInterval(playInterval);
    eraseLightOnAllSides();
    $(countText).text('0');
    order = [];
    turn = 0;
    $(".side").addClass('disabled');
    randomNumber();
    startPlay();
}

/*
Here, it takes place a random number from 1 (one) to 4 (four) and after that the number will be pushed into the instance array.
*/

function randomNumber() {
    randomNum = Math.ceil(Math.random() * 4);
    order.push(randomNum);
    console.log(order);
}

/* 
It's the computer's turn to generate an instance. It will add 1 to turn, and that way it will increase. After this, it will set the player's and computer's count back to '0' and set the player's instance back to an empty string.
It runs the player's interval which will keep a switch statement that will verify each of the number inside the instance array, generating the sound and light that corresponds to the number found and doing a break after each one, that way will be able o avoid the light and sound from the previous side that was selected. It will do this until it will reach the number value of the computer's count.
At the point the array instance lentgh matches the computer's count it will stop the play interval and allow the player to click. Then, the computer's count increases with 1.*/

function startPlay() {
    turn++;
    playerCount = 0;
    computerCount = 0;
    playerOrder = [];
    playInterval = setInterval(function() {
        switch (order[computerCount]) {
            case 1:
                SoundPlusGreenLight();
                break;
            case 2:
                SoundPlusRedLight();
                break;
            case 3:
                SoundPlusYellowLight();
                break;
            case 4:
                SoundPlusBlueLight();
                break;
            default:
                break;
        }
        if (order.length === computerCount) {
            clearInterval(playInterval);
            $(".side").removeClass('disabled');
        }
        computerCount++;
    }, 800);
}

/* 
Sounds and lights are being generated here.
*/

function SoundPlusGreenLight() {
    $(greenSide).addClass('green-light')
    playerTimeout();
    soundListen('green');
}

function SoundPlusRedLight() {
    $(redSide).addClass('red-light')
    playerTimeout();
    soundListen('red');
}

function SoundPlusYellowLight() {
    $(yellowSide).addClass('yellow-light')
    playerTimeout();
    soundListen('yellow');
}

function SoundPlusBlueLight() {
    $(blueSide).addClass('blue-light')
    playerTimeout();
    soundListen('blue');
}

/* 
Lights of all of the sides are being erased, with a timeout function that will erase all lights after a time interval.
*/

function playerTimeout() {
    playTimeout = setTimeout(function() {
        eraseLightOnAllSides();
    }, 400);
}

/*
Here all the sounds are being generated. Taking the argument of 'soundDo' and every time the function is called, it will take the argument of whatever sound needs to be implemented after 'sound-'.
*/

function soundListen(soundDo) {
    let sound = $(`#sound-${soundDo}`)[0];
    sound.currentTime = 0;
    sound.play();
}

/* 
Here, the lights are being removed, and all of the colors go back to their original state from being flashed.  
*/

function eraseLightOnAllSides() {
    $(greenSide).removeClass("green-light");
    $(redSide).removeClass("red-light");
    $(yellowSide).removeClass("yellow-light");
    $(blueSide).removeClass("blue-light");
}

// All of the colours will flash at the same time.

function addLightOnAllSides() {
    $(greenSide).addClass("green-light");
    $(redSide).addClass("red-light");
    $(yellowSide).addClass("yellow-light");
    $(blueSide).addClass("blue-light");
}

/* 
When the player loses, this function is to order a game over modal to appear with the final score.
*/

function displayModal() {
    $('#loseModal').modal('show');
    $(loseModalDisplay).text(turn);
}

/*
The game gets verified but this function, and will increase the player's count. With 2 (two) assigned variables will verify if the player's  and computer's instance match or not.
The 'If' statement comes into place to verify each of the possibilities during the game and react accordingly.
*/

function verify() {
    playerCount++;
    let playerPcOrdYes = playerOrder[playerCount - 1] === order[playerCount - 1];
    let playerPcOrdNo = playerOrder[playerCount - 1] !== order[playerCount - 1];
    /* 
    In this case, 'If' statement will verify that if the player arrived to 20 (twenty) on the play count, STRICT mode is On (true) and if the computer's instance array matches with the player's instance array. If 'True' the play interval will cease, the sides are deactivated and the winning function will run.
    */
    if (playerCount === 20 && strictMode && playerPcOrdYes) {
        clearInterval(playInterval);
        $(".side").addClass('disabled');
        winGame();
    }
    /* 
    The computer's instance array is verified if it matches the player's instance array. If yes, the a new random number gets pushed into the computer's array, sides are displayed, count text gets updated to the newest score and the gameplay will run. */
    
    else if (playerPcOrdYes) {
        if (playerOrder.length === turn) {
            randomNumber();
            $(".side").addClass('disabled');
            $(countText).text(playerCount);
            setTimeout(startPlay, 500);
        }
    }
    /* 
    The computer's instance array is verified if it matches the player's instance array, if not and STRICT mode is not active, the sides will be disabled, switch the turn back to the previous turn and light all sides, and the sound corresponding to lose will be heard together with the message "Try Again" on the count text, all the colors on the sides will be erased, the current score will be displayed and restart the previous instance again.
    */
    else if (playerPcOrdNo && !strictMode) {
        $(".side").addClass('disabled');
        turn--;
        soundListen('lost');
        $(countText).text('Try');
        addLightOnAllSides();
        setTimeout(function() {
            eraseLightOnAllSides();
            $(countText).text('Again');
            setTimeout(function() {
                $(countText).text(turn);
                setTimeout(startPlay, 500);
            }, 600);
        }, 600);
    }
    /* 
    STRICT mode is true, the computer's instance array doesn't match with the player's instance array, 'Else' statement will display that the player lost. Sides are disabled, losing sound heard, 'Lose' message in the count text displayed and all sides flashing at once. Flash dissapears, then the modal will appear showing the player's score.
    */
    else {
        $(".side").addClass('disabled');
        soundListen('lost');
        $(countText).text('Lose');
        addLightOnAllSides();
        setTimeout(function() {
            eraseLightOnAllSides();
            setTimeout(function() {
                $(countText).text(turn);
                displayModal();
            }, 600);
        }, 400);
    }
}

/* 
When the player becomes the WINNER  of the Simon Game, this function will show WIN in the count text, all sides will flash, together with the win sound and after the win modal will be displayed with the max score of 20.
*/

function winGame() {
    $(countText).text("WIN!");
    clearTimeout(playerTimeout);
    addLightOnAllSides();
    setTimeout(function() {
        $(winModalDisplay).text(turn);
        $('#winModal').modal('show');
        soundListen('win');
    }, 1400);
}
