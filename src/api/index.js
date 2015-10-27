var express = require('express'),
    v2      = require('./v2');

var api = express();

api.get('/', function(req, res){
	res.send('API');
});

api.use('/v2', v2);

module.exports = api;
