
// var worker = require('./worker');

var express = require('express');

// Constants
var PORT = 8080;

// App
var app = express();
app.get('/', function (req, res) {
  res.send('Hello world...\n');
});

app.get('/test', function (req, res) {
  res.send('Testing, testing, 1 2 3...\n');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
