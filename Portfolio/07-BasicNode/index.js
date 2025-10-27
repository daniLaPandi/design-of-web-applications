// Star Wars quotes library gets imported
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
const filePath = path.join(__dirname, "data", "input.txt"); // __dirname = is a special Node.js var that contains the this.absolute path of currect file's directory
// path.join() works independtly of Windows/macOS/Linux
fs.readFile(filePath, "utf8", (err, data) => { // fs = file system of Node.js for reading/writing files; utf8 is to read it as text instead of as bytes, and
    // the callback (err, data) means to run when the file is done reading
    if (err) {
        console.error("\nError reading the file: ", err);
        return; // function returns so no attempt is made to read data
    }
    console.log("\nThe secret message is: ", data); // if it works then the file gets read
});
