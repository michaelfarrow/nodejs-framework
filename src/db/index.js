
var mongo = require('mongoskin');
var db = mongo.db("mongodb://db:27017/prey", {native_parser:true});

db.bind('users').bind({

	getByName: function(name, callback){
		this.findOne({name: name}, callback);
	},

	getByKey: function(key, callback){
		this.findOne({key: key}, callback);
	}

});

db.bind('devices').bind({
	
	getByHash: function(hash, callback){
		this.findOne({hash: hash}, callback);
	},
	
	getByKey: function(key, callback){
		this.findOne({key: key}, callback);
	}

});

db.bind('commands').bind({

	getByDeviceId: function(id, callback){
		this.find({device_id: mongo.helper.toObjectID(id)}).toArray(callback);
	},

	getByCommandTarget: function(command, target, callback){
		this.find({command:command, target:target}).toArray(callback);
	}

});

db.bind('reports').bind({

	getByDeviceId: function(id, callback){
		this.find({device_id: mongo.helper.toObjectID(id)}).toArray(callback);
	}

});

module.exports = db;
