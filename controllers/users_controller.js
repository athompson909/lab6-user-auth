var crypto = require('crypto');
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDtWkCxBMVrziS_hxagImZumHnMvTsfZcw'
});
var mongoose = require('mongoose'),
  User = mongoose.model('User');

function hashPW(pwd) {
  return crypto.createHash('sha256').update(pwd).
  digest('base64').toString();
}
exports.signup = function(req, res) {
  console.log("Begin exports.signup");
  var user = new User({
    username: req.body.username
  });
  console.log("after new user exports.signup");
  user.set('hashed_password', hashPW(req.body.password));
  console.log("after hashing user exports.signup");
  user.set('email', req.body.email);
  console.log("after email user exports.signup");
  user.save(function(err) {
    console.log("In exports.signup");
    console.log(err);
    if (err) {
      res.session.error = err;
      res.redirect('/signup');
    } else {
      req.session.user = user.id;
      req.session.username = user.username;
      req.session.msg = 'Authenticated as ' + user.username;
      res.redirect('/');
    }
  });
};
exports.login = function(req, res) {
  User.findOne({
      username: req.body.username
    })
    .exec(function(err, user) {
      if (!user) {
        err = 'User Not Found.';
      } else if (user.hashed_password ===
        hashPW(req.body.password.toString())) {
        req.session.regenerate(function() {
          console.log("login");
          console.log(user);
          req.session.user = user.id;
          req.session.username = user.username;
          req.session.msg = 'Authenticated as ' + user.username;
          req.session.locations = user.locations;
          res.redirect('/');
        });
      } else {
        err = 'Authentication failed.';
      }
      if (err) {
        req.session.regenerate(function() {
          req.session.msg = err;
          res.redirect('/login');
        });
      }
    });
};
exports.getUserProfile = function(req, res) {
  User.findOne({
      _id: req.session.user
    })
    .exec(function(err, user) {
      if (!user) {
        res.json(404, {
          err: 'User Not Found.'
        });
      } else {
        res.json(user);
      }
    });
};
exports.updateUser = function(req, res) {
   console.log("Updating user");
   console.log(req.body);
   User.findOne({
      _id: req.session.user
    })
    .exec(function(err, user) {
      user.set('email', req.body.email);
      var passedLoc = (req.body.location);

      var myLat, myLng, myLoc;

      googleMapsClient.geocode({
        address: passedLoc
      }, function(err, response) {
        if (!err) {
          console.log(response.json.results[0].geometry.location);
          myLat = response.json.results[0].geometry.location.lat;
          myLng = response.json.results[0].geometry.location.lng;
          console.log("Latitude: " + myLat + " Longitude: " + myLng);

          myLoc = {
            name: passedLoc,
            lat: myLat,
            long: myLng,
            comments: [],
            photosURL: ""
          };

          console.log(myLoc);
          user.locations.push(myLoc);
          user.save(function(err) {
            if (err) {
              res.sessor.error = err;
            } else {
              req.session.msg = 'User Updated.';
              req.session.locations = user.locations;
            }
            res.redirect('http://ec2-35-162-240-187.us-west-2.compute.amazonaws.com:3004/');
          });
        }
      });
    });
};
exports.deleteUser = function(req, res) {
  User.findOne({
      _id: req.session.user
    })
    .exec(function(err, user) {
      if (user) {
        user.remove(function(err) {
          if (err) {
            req.session.msg = err;
          }
          req.session.destroy(function() {
            res.redirect('/login');
          });
        });
      } else {
        req.session.msg = "User Not Found!";
        req.session.destroy(function() {
          res.redirect('/login');
        });
      }
    });
};
