 // app/routes.js
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// grab the user model
var User = require('./models/user');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = function(app) {

    var router = express.Router();
    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging
        console.log('Something is happening.');
        next(); // make sure we go to the next routes and don't stop here
    });

    router.route('/users')
        // create a user (accessed at POST http://localhost:8080/api/users)
        .post(function(req, res) {
            
            var user = new User();      // create a new instance of the Usar model
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

    router.route('/users/:user_id')
        // get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        })
        .put(function(req, res) {
            // use our user model to find the user we want
            User.findById(req.params.user_id, function(err, user) {

                if (err)
                    res.send(err);

                user.firstName = req.body.firstName;  // set the users name (comes from the request)
                user.lastName = req.body.lastName;
                user.email = req.body.email;

                // save the user
                user.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'User updated!' });
                });

            });
        })
        // delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
        .delete(function(req, res) {
            User.remove({
                _id: req.params.user_id
            }, function(err, user) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted' });
            });
        });


    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);

    app.post('/register', function(req, res) {
        User.register(new User({ email : req.body.email }), req.body.password, function(err, user) {
            if (err) {
                return res.json({ message: 'error!' });
            }

            passport.authenticate('local')(req, res, function () {
                //res.redirect('/');
            });
        });
    });
    app.get('/login', function(req, res) {
        res.render('login', { user : req.user });
    });
    app.post('/login', passport.authenticate('local'), function(req, res) {
        res.redirect('/');
    });
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};
