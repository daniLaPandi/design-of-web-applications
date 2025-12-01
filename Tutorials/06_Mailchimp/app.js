const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
require("dotenv").config();

const port = 3000;

const app = express();

// Mailchimp API credentials from environment variables
const apiKey = process.env.MAILCHIMP_API_KEY;
const listId = process.env.MAILCHIMP_LIST_ID;
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

// Debug: Log environment variables
console.log("Environment variables loaded:");
console.log("API Key:", apiKey ? "✓ Loaded" : "✗ Missing");
console.log("List ID:", listId ? "✓ Loaded" : "✗ Missing");
console.log("Server Prefix:", serverPrefix ? "✓ Loaded" : "✗ Missing");

// Set up body-parser middleware to handle form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static("public"));

// Serve the signup.html page on the root route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup-news/signup.html");
});

// Handle form submission
app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    console.log("Form submission received:", { firstName, lastName, email });

    // Build the Mailchimp API URL
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}`;
    console.log("Mailchimp URL:", url);

    // Create the data object for Mailchimp
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    // Convert data to JSON string
    const jsonData = JSON.stringify(data);

    // Set up the request options
    const options = {
        method: "POST",
        auth: `anystring:${apiKey}`
    };

    // Make the request to Mailchimp API
    const mailRequest = https.request(url, options, (response) => {
        let responseData = "";

        // Collect the response data
        response.on("data", (chunk) => {
            responseData += chunk;
        });

        // Handle errors in the response stream
        response.on("error", (error) => {
            console.log("Response error:", error);
            res.sendFile(__dirname + "/failure.html");
        });

        // Process the complete response
        response.on("end", () => {
            console.log("Response status code:", response.statusCode);

            // Check if the status code is 200
            if (response.statusCode === 200) {
                try {
                    const parsedData = JSON.parse(responseData);
                    console.log("Mailchimp response:", JSON.stringify(parsedData, null, 2));

                    // Check if there are any errors
                    if (parsedData.error_count && parsedData.error_count > 0) {
                        console.log("Error:", parsedData.errors[0].error);
                        console.log("Error code:", parsedData.errors[0].error_code);
                        res.sendFile(__dirname + "/failure.html");
                    } else {
                        // Success!
                        console.log("Success! User subscribed.");
                        res.sendFile(__dirname + "/success.html");
                    }
                } catch (error) {
                    console.log("JSON parse error:", error);
                    res.sendFile(__dirname + "/failure.html");
                }
            } else {
                console.log("Non-200 status code:", response.statusCode);
                console.log("Response body:", responseData);
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });

    // Handle request errors
    mailRequest.on("error", (error) => {
        console.log("Request error:", error);
        res.sendFile(__dirname + "/failure.html");
    });

    // Write the data to the request body
    mailRequest.write(jsonData);

    // End the request
    mailRequest.end();
});

app.listen(port, () => {
    console.log("Listening on port 3000");
});