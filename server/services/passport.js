const bcrypt = require('bcrypt-nodejs');
const queries = require("../queries/users.js");
const passport = require('passport');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt')ExtractJwt.fromAuthHeaderWithScheme('Bearer');
const LocalStrategy =  require('passport-local');

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  queries.findUserByEmail(email)
    .then(function(result) {
      return Promise.resolve(result).then(function(res) {
        console.log(res[0].active)
        if (res[0].active === 1) {
          if (typeof res === 'object' && res.length == 1 ) {
            comparePassword(res[0].password, password,  function(err, isMatch) {
              if (err) {
                return done(err);
              }

              if (!isMatch) {
               return done(null, false);
              }

              return done(null, res);
            });
          } else {
            return done("That user doesn't exist", false)
          }
        }
        else {
          return done("That user isnt active", false)
        }
      })
    })
    .catch(function(err) {
      console.log(err);
    });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  queries.findUserById(payload.sub)
    .then(function(user) {
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

function comparePassword(candidatePassword, hashedPassword, callback) {
  bcrypt.compare(hashedPassword, candidatePassword, function(err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
}

passport.use(jwtLogin);
passport.use(localLogin);
