/*
This uses json-server, but with the module approach: https://github.com/typicode/json-server#module
Downside: You can't pass the json-server command line options.
Instead, can override some defaults by passing a config object to jsonServer.defaults();
You have to check the source code to set some items.
Examples:
Validation/Customization: https://github.com/typicode/json-server/issues/266
Delay: https://github.com/typicode/json-server/issues/534
ID: https://github.com/typicode/json-server/issues/613#issuecomment-325393041
Relevant source code: https://github.com/typicode/json-server/blob/master/src/cli/run.js
*/

/* eslint-disable no-console */
const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const sgMail = require("@sendgrid/mail");
const router = jsonServer.router(path.join(__dirname, "db.json"));

// Can pass a limited number of options to this to override (some) defaults. See https://github.com/typicode/json-server#api
const middlewares = jsonServer.defaults({
  // Display json-server's built in homepage when json-server starts.
  static: "node_modules/json-server/dist"
});

sgMail.setApiKey(
  "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"
);

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser. Using JSON Server's bodyParser
server.use(jsonServer.bodyParser);

// Simulate delay on all requests
server.use(function(req, res, next) {
  setTimeout(next, 0);
});

// Declaring custom routes below. Add custom routes before JSON Server router

// Add createdAt to all POSTS
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

server.post("/send-email/", (req, res) => {
  const { recipient, sender, topic, text } = req.body;

  const msg = {
    to: recipient,
    from: sender,
    subject: topic,
    text: "Secret Santa",
    html: `<strong>${text}</strong>`
  };

  sgMail
    .send(msg)
    .then(() => res.send({ msg: "Sent" }))
    .catch(error => res.send(error.message));
});

// Use default router
server.use(router);

// Start server
const port = 4001;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});