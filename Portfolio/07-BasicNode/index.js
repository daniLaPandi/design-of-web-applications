// Star Wars quotes
const starWarsQuotes = require("star-wars-quotes");

// superheroes and supervillains
const superheroes = require("superheroes");
const supervillains = require("supervillains");

// Node.js modules for file reading
const fs = require("fs");
const path = require("path");

// Hello World
console.log("Hello, world!");

// require tool + Multiple calls
console.log("\nA Star Wars quote:");
console.log(starWarsQuotes()); // this function gives a random quote every time the program is run
console.log("\nEpic Battle!: ", superheroes.randomSuperhero(), " vs. ", supervillains.randomSupervillain());

// read file + secret message
const filePath = path.join(__dirname, "data", "input.txt");

fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
        console.error("\nError reading the file: ", err);
        return;
    }
    console.log("\nThe secret message is: ", data);
});
