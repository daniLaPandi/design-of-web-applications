const express = require('express'); // part of creating an express server
const bodyParser = require('body-parser'); // this library helps to read raw data and be able to use it in my code
const path = require('path'); // also needed to create an express server

const app = express(); // creates the server instance called app(express server)
const PORT = 3000;  // this is the door that my computer is listening to for network traffic

// middleware: a function that runs before route handler and can modify the request or response
app.use(bodyParser.urlencoded({ extended: true }));

// route handler: in order to serve the static file of index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// post method to handle BMI calculation (requested from the server)
app.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);

    // BMI formula is (weight / height^2) * 10,000
    const bmi = (weight / (height * height)) * 10000;

    res.send(`<h1>Your BMI is ${bmi.toFixed(2)}</h1>
        <a href="/">Go back</a>`)});

// Start server's listening skills lol
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});