const Joi = require('joi');
const express = require('express');
const path = require('path');

// PORT is either specified by env, or our default value
const PORT = process.env.PORT || 3000;

// initialize our express application
const app = express();

// static files for our base URL
app.use(express.static('public'));

// bring in our quotes in JSON format
const quotes = require('./quotes.json');

// homepage sends index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// sends all of the quotes
app.get('/api/all', (req, res) => {
    res.send(quotes);
});

// sends a random quote (add num query string to get a number of quotes)
app.get('/api/rand', (req, res) => {
    // handle our optional number query string
    const { error, num } = validateNumber(req.query);
    if (error) return res.status(400).send(
        error.details[0].message
    );

    let randQuotes = [];
    // if num, send num of rand quotes, else, send just one
    if (num) {
        // if we don't have enough quotes, send all
        if (num>quotes.length) {
            res.send(quotes);
            return;
        };
        // else, fill and send array of random quotes
        for (i = 0; i < num; i++) {
            do {
                quote = getRandomQuote(quotes);
            } while (randQuotes.indexOf(quote)>-1);
            randQuotes.push(quote)
        }
    } else {
        res.send(
            getRandomQuote(quotes)
        );
    }
});

// helper function to get a random quote from input array
const getRandomQuote = (quotes) => {
    return quotes[Math.floor(Math.random() * Math.floor(quotes.length))];
};

// use Joi to validate num query string 
const validateNumber = (num) => {
    return Joi.validate(num, { num: Joi.number().optional() });
};

// serve the app at PORT
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));