// Dependencies
const express = require("express");
const router = express.Router();
const read = require("node-readability");

// Import ORM
const orm = require("../config/orm");

let user_email = null;

// Route handler for displaying default homepage
router.get("/", (req, res) => {
    console.log(`Home page requested.`);
    res.render("index");
});

// Page to load when authentiation is successful
router.get("/user", (req, res) => {
    console.log(`GET /user req.body: ${JSON.stringify(req.body)}`);
    res.render("user", { user_email: user_email });
    // res.json(req.body);
});

// Route for getting user dashboard
router.get("/user/dashboard", (req, res) => {
    orm.getUserPreference(user_email, (data) => {
        console.log(`returned from query.${JSON.stringify(data, null, 2)}`);
        res.render("user", { user: data });
    });
});


// Route handler to add new user to database
router.post("/signed_in", (req, res) => {
    user_email = req.body.user_email;
    console.log(`Data received: ${JSON.stringify(req.body)}`);
    const tableInput = "user_info";
    console.log(req.body);
    orm.createNewUser(req.body, result => {
        console.log("Successfully added new user.");

    });
    return res.render("user", { user_email: user_email });
});

// Set the user email address on the login screen after authentication
router.post("/api/user", (req, res) => {
    console.log(`POST/test: ${JSON.stringify(req.body)}`);
    user_email = req.body.user_email;
    res.json(req.body);
});

// Route handler for processing article URL
router.post("/article", (req, res) => {
    // Convert URL into Readability version
    getArticle(req, res, req.body.url);
});

// Get the reader version of the article
function getArticle(req, res, url) {
    try {
        read(url, (err, article, meta) => {
            if (err) { throw err; }
            const content = {
                title: article.title,
                article: article.textBody
            }
            article.close();
            console.log(`SUCCESS`);

            res.render("index", content);


        });
    } catch (error) {
        console.log(`Error Logged: ${error}`);
    }
}

// Export router functionality for server to use
module.exports = router;