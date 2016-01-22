 // app/routes.js
var express        = require('express');
// grab the nerd model we just created
var User = require('./models/user');

    module.exports = function(app) {

        var router = express.Router();
        // middleware to use for all requests
        router.use(function(req, res, next) {
            // do logging
            console.log('Something is happening.');
            next(); // make sure we go to the next routes and don't stop here
        });

        router.route('/users')
            // create a bear (accessed at POST http://localhost:8080/api/bears)
            .post(function(req, res) {
                
                var user = new User();      // create a new instance of the Bear model
                user.firstName = req.body.firstName;  // set the users name (comes from the request)
                user.lastName = req.body.lastName;
                user.email = req.body.email; 
                // save the user and check for errors
                user.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'user created!' });
                });
                
            })
            .get(function(req, res) {
                User.find(function(err, users) {
                    if (err)
                        res.send(err);

                    res.json(users);
                });
            });
        // more routes for our API will happen here

        // REGISTER OUR ROUTES -------------------------------
        // all of our routes will be prefixed with /api
        app.use('/api', router);

    };
