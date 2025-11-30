const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const port = 3000;

const app = express();

// Mailchimp API credentials
const apiKey = "48493443c31b2e185648c22297df1fc6-us18";
const listId = "ce3b4f0c7b";
const serverPrefix = "us18";

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

    // Build the Mailchimp API URL
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}`;

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
            // Check if the status code is 200
            if (response.statusCode === 200) {
                try {
                    const parsedData = JSON.parse(responseData);
                    console.log("Mailchimp response:", parsedData);

                    // Check if there are any errors
                    if (parsedData.error_count && parsedData.error_count > 0) {
                        console.log("Error:", parsedData.errors[0].error);
                        console.log("Error code:", parsedData.errors[0].error_code);
                        res.sendFile(__dirname + "/failure.html");
                    } else {
                        // Success!
                        res.sendFile(__dirname + "/success.html");
                    }
                } catch (error) {
                    console.log("JSON parse error:", error);
                    res.sendFile(__dirname + "/failure.html");
                }
            } else {
                console.log("Status code:", response.statusCode);
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