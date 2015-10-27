var db      = require('../../db'),
    async   = require('async');

var commands = {}

commands.remove = function(command, callback){
	db.commands.remove({_id: command._id}, function(err){
		callback(!err);
	});
};

commands.get = function(device_id, callback){
	db.commands.getByDeviceId(device_id, function(err, items){
		var returnCommands = [];

		if(items)
			returnCommands = items;

		async.eachSeries(returnCommands, function(command, cb){
			commands.remove(command, cb);
		}, function(err) {
			callback(returnCommands);
		});
	});
};

commands.add = function(device_id, command, callback){
	db.commands.getByCommandTarget(command.command, command.target, function(err, items){
		async.eachSeries(items, function(command, cb){
			commands.remove(command, cb);
		}, function(err) {
			command.device_id = mongo.helper.toObjectID(device_id);
			db.commands.insert(command, function(err, result){
				callback();
			});
		});
	});
};

module.exports = commands;
