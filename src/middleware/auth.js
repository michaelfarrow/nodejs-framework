var auth   = require('basic-auth'),
	db     = require('../db'),
	bcrypt = require('bcrypt-nodejs');

function needsAuthentication(res){
	res.statusCode = 401;
	res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
	res.send('Authorization required');
}

module.exports = function(req, res, next) {
	console.log('AUTH: ' + req.url);

	var credentials = auth(req);

	if(!credentials){
		needsAuthentication(res);
		return;
	}

	if(credentials.pass == 'x'){
		
		db.users.getByKey(credentials.name, function(err, user){
			if(!err && user){
				req.user = user;
				next();
			}else{
				needsAuthentication(res);
				return;
			}
		});

	}else{

		db.users.getByName(credentials.name, function(err, user){
			if(user){
				bcrypt.compare(credentials.pass, user.password, function(err, result) {
					if(result){
						req.user = user;
						next();
					}else{
						needsAuthentication(res);
					}
				});
			}else{
				needsAuthentication(res);
			}
		});

	}
};
