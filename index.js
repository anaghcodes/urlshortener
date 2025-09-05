require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");
const { url } = require("inspector");
const app = express();

let urls = new Object();
let counter = 1;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.post("/api/shorturl", function (req, res) {
  const original_url = req.body.url;

  const hostname = new URL(original_url).hostname;

  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }
    urls[counter] = original_url;

    res.json({ original_url: original_url, short_url: counter });

    counter++;
  });
});

app.get("/api/shorturl/:code", (req, res) => {
  const code = Number(req.params.code);
  if (urls[code]) {
    res.redirect(urls[code]);
  } else {
    res.json({ error: "Invalid url" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
