// for the first dice
var randomNumber1 = Math.floor(Math.random() * 6) + 1;
var ranDice1 = "dice" + randomNumber1 + ".png"; //adds the word dice, a random number from 1 to 6, and the .png
image1 = document.querySelectorAll("img")[0];
image1.setAttribute("src", "images/" + ranDice1);

// for the second dice
var randomNumber2 = Math.floor(Math.random() * 6) + 1;
var ranDice2 = "dice" + randomNumber2 + ".png"; //adds the word dice, a random number from 1 to 6, and the .png
image2 = document.querySelectorAll("img")[1];
image2.setAttribute("src", "images/" + ranDice2);

// which player wins
if (randomNumber1 > randomNumber2) {
  document.querySelector("h1").innerHTML = "Player 1 Wins!";
}
else if (randomNumber1 < randomNumber2) {
  document.querySelector("h1").innerHTML = "Player 2 Wins!";
}
else {
  document.querySelector("h1").innerHTML = "It's a tie!";
}
