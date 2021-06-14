require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
app.use(bodyParser.urlencoded({ extended: true }));

const userName = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

const URL = "mongodb+srv://"+userName+":"+password+"@cluster0.vrici.mongodb.net/Mechanical_switches?retryWrites=true&w=majority";

// connect to database
mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("There was some sort of error in connecting to the database");
    
  })

const urls = require('./models/urls');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.json())

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.post('/api/shorturl', function(req, res) {
  const urlRegex = /((http(s)?:\/\/.)(www\.)?){1}[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g 
  let new_url = req.body.url;
  console.log(req.body)
  let shortcut_url = getRandomInt(Number.MAX_SAFE_INTEGER).toString();

  // checks if url string is actualy a valid url
  if(new_url.match(urlRegex) !== null && new_url.match(urlRegex).length == 1){
    console.log("url reads as an actual url")

    // check to see if existing shortcut url is already in database and corrects for it
    urls.find({})
    .then((results) => {
      for(url in results) {
        if(url.short_url === shortcut_url){
          console.log("not valid short url")
          shortcut_url = getRandomInt(Number.MAX_SAFE_INTEGER).toString();
          
        }
      }   
    }) 

    // adds the url to the database
    urls.create({original_url: new_url, short_url: shortcut_url}, (err, urls) => {
      if(err){
        res.send({error: 'database error'})
        return;
      }

      res.send({original_url: urls.original_url, short_url: parseInt(urls.short_url)});
      return;
    })

  } else {
    res.send({ error: 'invalid url' })
  }
  

})

app.post('/api/shorturl/new', function(req, res) {
  const urlRegex = /((http(s)?:\/\/.)(www\.)?){1}[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g 
  let new_url = req.body.url;
  console.log(req.body)
  let shortcut_url = getRandomInt(Number.MAX_SAFE_INTEGER).toString();

  // checks if url string is actualy a valid url
  if(new_url.match(urlRegex) !== null && new_url.match(urlRegex).length == 1){
    console.log("url reads as an actual url")

    // check to see if existing shortcut url is already in database and corrects for it
    urls.find({})
    .then((results) => {
      for(url in results) {
        if(url.short_url === shortcut_url){
          console.log("not valid short url")
          shortcut_url = getRandomInt(Number.MAX_SAFE_INTEGER).toString();
          
        }
      }   
    }) 

    // adds the url to the database
    urls.create({original_url: new_url, short_url: parseInt(shortcut_url)}, (err, urls) => {
      if(err){
        res.send({error: 'database error'})
        return;
      }

      res.send({original_url: urls.original_url, short_url: parseInt(urls.short_url)});
      return;
    })

  } else {
    res.send({ error: 'invalid url' })
  }
  

})

app.get('/api/shorturl/:short_url', function(req, res) {
  
  urls.findOne({short_url: req.params.short_url}, (err,result) => {
    res.redirect(result.original_url)
  })

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
