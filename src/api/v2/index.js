var express  = require('express'),
    tools    = require('../../tools'),
    paths    = require('../../tools/paths'),
    db       = require('../../db'),
    md5      = require('md5');
    inspect  = require('util').inspect,
    mv       = require('mv'),
    rimraf   = require('rimraf'),
    fs       = require('fs'),
    async    = require('async'),
    mongo    = require('mongoskin'),
    commands = require('./commands');

var v2 = express();


// db.commands.insert(
// 	{
// 		device_id: mongo.helper.toObjectID('5613047370cbe6b915bd7a73'),
// 		command: 'report',
// 		target: 'stolen',
// 		options: {
// 			interval: 1
// 		}
// 	}
// );

// db.commands.insert(
// 	{
// 		device_id: mongo.helper.toObjectID('5613047370cbe6b915bd7a73'),
// 		command: 'cancel',
// 		target: 'stolen',
// 		options: {}
// 	}
// );

// db.commands.insert(
// 					{
// 						device_id: mongo.helper.toObjectID('5613047370cbe6b915bd7a73'),
// 						command: 'start',
// 						target: 'alert',
// 						options: {
// 							message: 'Help me!',
// 							title: 'Hi...',
// 							level: 'warn', // warning, warn
// 							reply: true // ,entry,response
// 						}
// 					}
// );

// db.commands.insert(
// 					{
// 						device_id: mongo.helper.toObjectID('5613047370cbe6b915bd7a73'),
// 						command: 'start',
// 						target: 'alert',
// 						options: {
// 							message: 'Help me!',
// 							title: 'Hi...',
// 							level: 'warn', // warning, warn
// 							reply: true // ,entry,response
// 						}
// 					}
// );

commands.add('5613047370cbe6b915bd7a73', 
	{
						command: 'start',
						target: 'alert',
						options: {
							message: 'Help me!',
							title: 'Hi...',
							level: 'warn', // warning, warn
							// reply: true // ,entry,response
						}
					}, function(){

					}
);

commands.add('5613047370cbe6b915bd7a73', 
	{
						command: 'start',
						target: 'remote-terminal',
						options: {
							remote_host: 'mikefarrow@foreman.mikefarrow.co.uk',
							remote_port: 19999,
						}
					}, function(){

					}
);

// db.reports.getByDeviceId('5613047370cbe6b915bd7a73', function(err, items){
// 	console.log(err, items);
// 	if(items){
// 		console.log(items);
// 	}
// })

db.devices.find().toArray(function(err, result){
	console.log(result);
});

v2.get('/', function(req, res){
	res.send('v2 API');
});

v2.get('/profile.json', function(req, res){
	res.send(req.user);
});

v2.post('/devices.json', function(req, res){
	var response = {};
	var device_hash = '';

	if(tools.checkNested(req.body, 'specs', 'firmware_info', 'uuid')){
		device_hash = md5(req.body.specs.firmware_info.uuid);
	}else{
		resp.send('Could not find a suitable UUID');
		return;
	}

	db.devices.getByHash(device_hash, function(err, result) {
		if (result) {
			console.log('Device found, returning key');
			response.key = result.key;
			res.send(response);
		}else{
			console.log('Device not found, creating');

			device_key = md5(device_hash + '' + tools.timestamp());

			db.devices.insert({
				hash: device_hash,
				key: device_key,
				missing: false,
				data: req.body
			}, function(err, result){
				if (err) {
					console.log(err);
					res.send('Could not create device');
				}else{
					response.key = device_key;
					res.send(response);
				}
			});
		}
	});
});

v2.get('/devices/:key.json', function(req, res){
	console.log('checking device');

	db.devices.getByKey(req.params.key, function(err, result) {
		if(result){
			// res.send([
			// 		{
			// 			command: 'start',
			// 			target: 'alert',
			// 			options: {
			// 				message: 'Help me!',
			// 				title: 'Hi...',
			// 				level: 'warn', // warning, warn
			// 				reply: true // ,entry,response
			// 			}
			// 		}
			// 	]);

			// if(result.missing){
			// 	console.log('requesting stolen report');
			// 	res.send([
			// 		{
			// 			command: 'report',
			// 			target: 'stolen',
			// 			options: {
			// 				interval: 1
			// 			}
			// 		}
			// 	]);
			// }else{
			// 	console.log('sending nothing');
			// 	res.send([
			// 		{
			// 			command: 'cancel',
			// 			target: 'stolen',
			// 			options: {}
			// 		}
			// 	]);
			// }

			commands.get(result._id, function(commands){
				res.send(commands);
			});

		}else{
			res.sendStatus(404);
		}
	});
});


v2.get('/devices/:key/reports.json', function(req, res){

	db.devices.getByKey(req.params.key, function(err, result){
		if(res){
			db.reports.getByDeviceId(result._id, function(err, items){
				if(items){
					res.send(items);
				}else{
					res.send([]);
				}
			});
		}else{
			res.sendStatus(404);
		}
	});

});
// v2.get('/devices/:key/status.json', function(req, res){
// 	console.log(req.url);
// 	res.send(req.url + ' ' + req.params.key);
// });

// v2.post('/devices/:key/data.json', function(req, res){
// 	console.log(req.url);
// 	res.send(req.url + ' ' + req.params.key);
// });

v2.post('/devices/:key/reports.json', function(req, res){

	var images = [];

	db.devices.getByKey(req.params.key, function(err, result) {
		if(result){

			async.forEachOfSeries(req.files, function iterator(file, type, callback) {
				var destDir = paths.images + '/' + req.params.key;
				var filenameSplit = file.filename.split('.');
				var filename = file.uuid + '.' + filenameSplit[filenameSplit.length - 1];
				var dest = destDir + '/' + filename;

				if (!fs.existsSync(destDir)){
				    fs.mkdirSync(destDir);
				}

				// console.log('moving', file.file, 'to', dest);

				mv(file.file, dest, function(err){
					// console.log('moved');

					// console.log('attempting to remove:', paths.uploads + '/' + file.uuid);

					rimraf(paths.uploads + '/' + file.uuid, function(){
						// console.log('upload dirs: ', fs.readdirSync(paths.uploads));
						// console.log('upload dirs: ', fs.readdirSync(destDir));
						images.push({
							type: type,
							path: dest
						});

						callback();
					});
				});
			}, function(err) {
				var data = req.body;
				data.device_id = result._id;
				data.images = images;
				data.date = new Date();

				db.reports.insert(data, function(err, result){
					if (err) {
						console.log(err);
						res.send('Could not create report');
					}else{
						res.sendStatus(200);
					}
				});
			});
		}else{
			res.sendStatus(404);
		}
	});
});

v2.post('/devices/:key/response.json', function(req, res){
	console.log('POST: ' + req.url);
	console.log(req.params);
	console.log(req.body);
	console.log(req.files);
	res.sendStatus(200);
});

v2.post('/devices/:key/events.json', function(req, res){
	console.log('POST: ' + req.url);
	console.log(req.params);
	console.log(req.body);
	console.log(req.files);
	res.sendStatus(200);
});

v2.post('/devices/:key/data.json', function(req, res){
	console.log('POST: ' + req.url);
	console.log(req.params);
	console.log(req.body);
	console.log(req.files);
	res.sendStatus(200);
});

v2.get('/*', function(req, res){
	console.log('GET: ' + req.url);
});

v2.post('/*', function(req, res){
	console.log('POST: ' + req.url);
});

module.exports = v2;
