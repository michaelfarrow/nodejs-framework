
var interval = 0.5; // minutes

var run = function() {

	var d = new Date();
	console.log(d.toLocaleString() + ': Doing stuff');

	setTimeout(run, interval * 60 * 1000);

}

run();
