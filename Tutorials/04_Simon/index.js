var buttonColors = ["red", "blue", "green", "yellow"];
var pattern = [];   // this shall be storing the game's pattern
var userClick = []; // this shall be storing the user's pattern
var level = 0;
var start = false;

// event listener to start the game with key press
$(document).on("keydown", function() {
    if (!start) {
        $("#level-title").text("Level " + level);
        nextSequence();
        start = true;
    }
});

// event listener for when a button is clicked
$(".btn").on("click", function() {
    var userClicked = $(this).attr("id");
    userClick.push(userClicked);
    playSound(userClicked);
    animatePress(userClicked);
    check(userClick.length -1);
});

// function to check if the sequence input by user is correct
function check(order) {
    if (pattern[order] === userClick[order]) {
      if (userClick.length === pattern.length){ // all correct user clicks for the whole pattern array
        setTimeout(function () {
          nextSequence();
        }, 1000);
      }
    } else {
      playSound("wrong");
      $("body").addClass("game-over");
      $("#level-title").text("Game Over (Press Any Key to Restart)");

      setTimeout(function () {
        $("body").removeClass("game-over");
      }, 200);

      startAgain();
    }
}

// function to play sound 
function playSound(color) {
    var sound = new Audio("sounds/" + color + ".mp3");
    sound.play();
}

// function for when the next level is obtained
function nextSequence() {
    var ranNum = Math.floor(Math.random() * 4);
    var ranColor = buttonColors[ranNum];
    pattern.push(ranColor);
    level++;

    $("#level-title").text("Level " + level); // the $ is jQuery's main function, then selects the id, then sets the text to desired input

    userClick = []; // must be reset every level

    $("#" + ranColor).fadeIn(110).fadeOut(110).fadeIn(110);
    playSound(ranColor);
}

// function to show when a button is clicked
function animatePress(color) {
    $("#" + color).addClass("pressed");
    setTimeout(function () {
        $("#" + color).removeClass("pressed");
    }, 100);
}

// function to start over
function startAgain() {
    level = 0;
    pattern = [];
    start = false;
}
