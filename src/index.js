
var env     = require('node-env-file'),
    flag    = require('node-env-flag'),
    fs      = require('fs'),
    express = require('express');

// var worker = require('./worker');

var envPath = __dirname + '/.env.' + process.env.NODE_RUN_ENV;

if(fs.existsSync(envPath)){
  env(envPath);
}

// Constants
var PORT = 8080;

var converter = require("./app/converter");



var mongoose = require('mongoose');
mongoose.connect('mongodb://db:27017/test');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  var kittySchema = mongoose.Schema({
    name: String
  });
  kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}
  var Kitten = mongoose.model('Kitten', kittySchema);
//   var silence = new Kitten({ name: 'Silence' });
//   console.log(silence.name); // 'Silence'
  var fluffy = new Kitten({ name: 'fluffy' });
//   fluffy.save(function (err, fluffy) {
//   if (err) return console.error(err);
//   fluffy.speak();
// });
// fluffy.speak(); // "Meow name is fluffy"
Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
})
});
// var Cat = mongoose.model('Cat', { name: String });

// var kitty = new Cat({ name: 'Zildjian' });
// kitty.save(function (err) {
//   if (err) {

//   }else{
//     console.log('meow');
//   }
// });



// App
var app = express();
app.set('view engine', 'jade');
app.use('/components', express.static(__dirname + '/bower_components'));

app.get("/", function(req, res) {
  res.render('polymer');
});


app.get("/rgbToHex", function(req, res) {
  var red   = parseInt(req.query.red, 10);
  var green = parseInt(req.query.green, 10);
  var blue  = parseInt(req.query.blue, 10);

  var hex = converter.rgbToHex(red, green, blue);

  res.send(hex);
});

app.get("/hexToRgb", function(req, res) {
  var hex = req.query.hex;

  var rgb = converter.hexToRgb(hex);

  res.send(JSON.stringify(rgb));
});



// app.get('/', function (req, res) {
//   res.send('Hello world...\n');
// });

// app.get('/test', function (req, res) {
//   res.send('Testing, testing, 1 2 3...\n');
// });

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
