"use strict";

const { query } = require("express");
// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");

let somethingFunny = false;

express()
  // Below are methods that are included in express(). We chain them for convenience.
  // --------------------------------------------------------------------------------

  // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
  .use(morgan("tiny"))

  // Any requests for static files will go into the public folder
  .use(express.static("public"))

  // Nothing to modify above this line
  // ---------------------------------
  // add new endpoints here 👇

  .get("/cat-message", (req, res) => {
    const message = { author: "cat", text: "Meow" };
    const randomTime = Math.floor(Math.random() * 3000);
    setTimeout(() => {
      res.status(200).json({ status: 200, message });
    }, randomTime);
  })

  .get("/monkey-message", (req, res) => {
    const messages = [
      "Don’t monkey around with me.",
      "If you pay peanuts, you get monkeys.",
      "I fling 💩 at you!",
      "🙊",
      "🙈",
      "🙉",
    ];
    const response = Math.floor(Math.random() * messages.length);
    const message = { author: "monkey", text: messages[response] };
    const randomTime = Math.floor(Math.random() * 2000);
    setTimeout(() => {
      res.status(200).json({ status: 200, message });
    }, randomTime);
  })

  .get("/parrot-message", (req, res) => {
    console.log(req.query);
    const message = { author: "parrot", text: req.query.text };
    const randomTime = Math.floor(Math.random() * 3000);
    setTimeout(() => {
      res.status(200).json({ status: 200, message });
    }, randomTime);
  })

  .get("/bot-message", (req, res) => {
    const commonGreetings = ["hi", "hello", "howdy"];
    // some means at least one needs to be true
    const includesUserGreeting = commonGreetings.some((greeting) => {
      // if the former user message included "something funny" do not look for greetings as it will find "hi" in "somet-hi-ng"
      if (req.query.text.toLowerCase().includes("something funny")) {
        return;
      }
      return req.query.text.toLowerCase().includes(greeting.toLowerCase());
    });

    const commonGoodbyes = ["bye", "farewell", "later"];
    // some means at least one needs to be true
    const includesUserGoodbye = commonGoodbyes.some((goodbye) => {
      return req.query.text.toLowerCase().includes(goodbye.toLowerCase());
    });

    const jokesArray = [
      "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
      "Why did the programmer quit his job? Because he didn't get arrays.",
      "What did the Java code say to the C code? You've got no class.",
    ];
    // selects a random joke within the jokes array
    const joke = jokesArray[Math.floor(Math.random() * jokesArray.length)];
    const includesJokeRequest = req.query.text
      .toLowerCase()
      .includes("something funny");

    // default bot message return
    let botMessage = "bzzt " + req.query.text;

    // if the user input message includes a common greeting
    if (includesUserGreeting) {
      botMessage = "Hello!";
      // if the user input message includes a common goodbye
    } else if (includesUserGoodbye) {
      botMessage = "Goodbye!";
      // if the user input message includes "something funny"
    } else if (includesJokeRequest) {
      somethingFunny = true;
      botMessage = "Do you want to hear a joke?";
    }

    // if something funny is true (the user has already submitted a message including "something funny")
    if (somethingFunny === true) {
      // if the user message includes "yes"
      if (req.query.text.toLowerCase().includes("yes")) {
        botMessage = joke + " Do you want to hear another?";
        // if the user message includes "no"
      } else if (req.query.text.toLowerCase().includes("no")) {
        somethingFunny = false;
        botMessage = "Goodbye...";
      }
    }

    const message = { author: "bot", text: botMessage };

    const randomTime = Math.floor(Math.random() * 3000);
    setTimeout(() => {
      res.status(200).json({ status: 200, message });
    }, randomTime);
  })
  // add new endpoints here ☝️
  // ---------------------------------
  // Nothing to modify below this line

  // this serves up the homepage
  .get("/", (req, res) => {
    res
      .status(200)
      .json({ status: 200, message: "This is the homepage... it's empty :(" });
  })

  // this is our catch all endpoint. If a user navigates to any endpoint that is not
  // defined above, they get to see our 404 page.
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not the page you are looking for.",
    });
  })

  // Node spins up our server and sets it to listen on port 8000.
  .listen(8000, () => console.log(`Listening on port 8000`));
