const queries = require("../queries/users.js");
const passportService = require('../services/passport');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user[0].id , iat: Math.floor(Date.now() / 1000) - 30 }, config.secret);
}

module.exports = app => {
  app.post("/api/signup", function (req, res, next) {
    queries.saveUser(req.body.email, req.body.pass, function(err) {
      if (err) {
        return next(err);
      }
    })
      .then(function (result) {
          console.log(result)
          res.status(200).json(result)
      })
      .catch(function (error) {
          next(error);
      });
  });
  app.post('/api/login', requireSignin,
  function(req, res, next) {
    res.send({ token: tokenForUser(req.user) });
  });
  app.get("/user/:id", function (req, res, next) {
    queries.findUserById(req.params.id)
      .then(function (result) {
          res.status(200).json(result)
      })
        .catch(function (error) {
            next(error);
        });
  });
  app.post('/api/user/activate', requireAuth,
  function(req, res, next) {
    queries.activateUser(req.body.email)
      .then( result => {
        res.send({ "message": "activated " + result[0].email });
      })
  });
  app.post('/api/user/deactivate', requireAuth,
  function(req, res, next) {
    queries.deactivateUser(req.body.email)
      .then( result => {
        res.send({ "message": "deactivated " + result[0].email });
      })
  });
}
