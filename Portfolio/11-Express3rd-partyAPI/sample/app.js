const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require("path"); // need it for da res.sendFile
const FormData = require("form-data"); 

// OpenWeatherMap API Key
const API_KEY = "6f4d4d32a00222ca96c559c4b1892b46";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const PORT = 3000;

const app = express();

// middleware to parse form data from the index.html POST request
app.use(bodyParser.urlencoded({ extended: true }));

// GET Route for serving html form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// POST Route for form submission + API call
app.post("/", (req, res) => {
    const cityName = req.body.cityName;
    
    // making the API URL - city name, API key, and metric (c temp) units
    const url = `${BASE_URL}?q=${cityName}&appid=${API_KEY}&units=metric`;

    // make secure GET request to API
    https.get(url, (apiResponse) => {
        let rawData = '';

        // collect all data chunks from the response
        apiResponse.on("data", (chunk) => {
            rawData += chunk;
        });

        // clean the full response once all data is received
        apiResponse.on("end", () => {
            try {
                const weatherData = JSON.parse(rawData);

                // Error Handling when the city is not found (Status Code or API response code)
                if (apiResponse.statusCode !== 200 || weatherData.cod !== 200) {
                    const errorMessage = weatherData.message || 'City not found or invalid request.';
                    return res.send(`
                        <h1>Error</h1>
                        <p>Could not fetch weather data for "${cityName}". Reason: ${errorMessage}</p>
                        <a href="/">Go back</a>
                    `);
                }

                // Success Handling
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const iconIndex = weatherData.weather[0].icon;
                
                // make the icon URL
                const iconURL = `http://openweathermap.org/img/wn/${iconIndex}@2x.png`;
                
                // construct the final response page with all requested data
                res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Weather for ${cityName}</title>
                    </head>
                    <body>
                        <h1>Current Weather in ${cityName}</h1>
                        <p>The temperature is <strong>${temp.toFixed(1)}°C</strong>.</p>
                        <p>Description: <strong>${description}</strong></p>
                        <img src="${iconURL}" alt="${description}">
                        <br>
                        <a href="/">Go back to the form</a>
                    </body>
                    </html>
                `);

            } catch (e) {
                // JSON Parsing Error Handling
                res.send(`
                    <h1>Internal Server Error</h1>
                    <p>Failed to process the weather data. This may indicate an issue with the API response format.</p>
                    <a href="/">Go back</a>
                `);
                console.error("JSON Parsing Error:", e);
            }
        });
    })
    // Network/Connection Error Handling
    .on('error', (err) => {
        res.send(`
            <h1>Connection Error</h1>
            <p>Could not connect to the weather service: ${err.message}</p>
            <a href="/">Go back</a>
        `);
        console.error("HTTPS Request Error:", err.message);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});