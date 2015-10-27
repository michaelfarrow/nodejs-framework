global.request = require('request');
global.chai = require('chai');
global.expect = chai.expect;

// var test = require('../app/converter');
// before(function() {
//   var matchesBlanket, runningTestCoverage;
//   matchesBlanket = function(path) {
//     return path.match(/node_modules\/blanket/);
//   };
//   runningTestCoverage = Object.keys(require.cache).filter(matchesBlanket).length > 0;
//   if (runningTestCoverage) {

//   	console.log(__dirname);

//     return require('require-dir')(__dirname + "/../", {
//       recurse: true,
//       duplicates: true
//     });
//   }
// });
