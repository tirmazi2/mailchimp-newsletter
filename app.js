//jshint esversion:6

// Deployed: https://ali-hamxa-maillist.herokuapp.com/
// Mailchimp docs: https://mailchimp.com/developer/marketing/

// Required Modules
const express = require("express");
const https = require("https");

// Create server and use modules
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes for get and post requests and responses
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/signup.html");
});

app.post("/", (req, res) => {
    // Parse parameters from POST request
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    
    // Prepare url, options and data for Mailchimp request and response
    const url = "https://{server}.api.mailchimp.com/3.0/lists/{list_id}";
    const options = {
        method:"POST",
        auth:"<username>:<api_key>"
    }

    // Mailchimp memebers data
    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }

    // Convert data into packed JSON string
    const jsonData = JSON.stringify(data);

    // Call Mailchimp Api and write data
    // if sccuessfull, display success else failure
    const request = https.request(url, options, function(response){
        if (response.statusCode === 200)
            res.sendFile(__dirname + "/public/success.html");
        else
            res.sendFile(__dirname + "/public/failure.html");
    });

    request.write(jsonData);
    request.end();

});

// Redirect to '/', if something went wrong
app.post("/failure", function(req, res) {
    res.redirect("/");
});

// Listener for server for both Heroku and localhost
app.listen(process.env.PORT || 3000, console.log("Server started at port: 3000..."));