var express        = require('express');
var app            = express();
//var mock           = require('./app/mock');
//var admin          = require('sriracha-admin');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(db) {

  mongoose.connect(db.url);

	// app.use('/admin', admin({
	//   User: {
	//       searchField: 'email',
	//   },
	//   hideFields: ['__v']
	// }));

	app.use(bodyParser.json()); 

	// // parse application/vnd.api+json as json
	app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

	// // parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true })); 

	// // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
	app.use(methodOverride('X-HTTP-Method-Override')); 

	// init passport
	//app.use(express.session());
	app.use(passport.initialize());

	// // routes ==================================================
	require('./app/routes')(app); // configure our routes

	var server = app.listen(8079, function() {
	  //mock.init();
	  console.log('Pavment is now listening on port %s, radical', 8079);
	  app.use(express.static('build'));
	});
	server.on('close', function(done) { 
	    console.log('Pavment is now closing on port %s, peace', 8079);
	});

	process.on('SIGINT', function() {
	  server.close();
	  mock.destroy(function() {
	    process.kill(0);
	  });
	});
}