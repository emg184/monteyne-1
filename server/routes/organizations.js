const queries = require("../queries/organizations.js");
const keys = require('../config');
const passportService = require('../services/passport');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');

const requireAuth = passport.authenticate('jwt', { session: false });

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user[0].id , iat: Math.floor(Date.now() / 1000) - 30 }, config.secret);
}

module.exports = app => {
  app.get('/api/organizations', function(req, res, next) {
    queries.getAllOrganizations()
      .then(function(organizations) {
        res.status(200).json(organizations)
      })
      .catch(function(error) {
        next(error);
      });
  });
  app.post('/api/organizations', requireAuth, function(req, res, next) {
    queries.addOrganization(req.body.name, req.body.slug_id, req.body.active,
req.body.image, req.body.primary, req.body.secondary, req.body.head, req.body.foot)
      .then(function() {
        res.status(200).json({message:"inserted"});
      })
        .catch(function(error) {
          next(error);
        });
  })
  app.delete('/api/organizations/:slug_id', requireAuth, function(req, res, next) {
    queries.deleteOrganization(req.params.slug_id)
    .then(function() {
      res.status(200).json({message:"delete"});
    })
      .catch(function(error) {
        next(error);
      });
  })
  app.put('/api/organizations/:slug_id/deactivate', requireAuth, function(req, res, next) {
    queries.deactivateOrganization(req.params.slug_id)
    .then(function() {
      res.status(200).json({message:"deactivated"});
    })
      .catch(function(error) {
        next(error);
      });
  })
  app.put('/api/organizations/:slug_id/activate', requireAuth, function(req, res, next) {
    queries.activateOrganization(req.params.slug_id)
    .then(function() {
      res.status(200).json({message:"activated"});
    })
      .catch(function(error) {
        next(error);
      });
  })
  app.put('/api/organizations/:slug_id', requireAuth, function(req, res, next) {
    queries.updateOrganization(req.body.id, req.body.name, req.body.slug_id, req.body.active,
req.body.image, req.body.primary, req.body.secondary, req.body.head, req.body.foot)
      .then(function() {
        res.status(200).json({ message:"updated" });
      })
        .catch(function(error) {
          next(error);
        })
  })
  app.get('/api/organizations/:slug_id', function(req, res, next) {
    queries.getOrganization(req.params.slug_id)
      .then(function(organization) {
        res.status(200).json(organization)
      })
      .catch(function(error) {
        next(error);
      });
  });
  app.get('/api/organizations/:slug_id/all', function(req, res, next) {
    queries.getAllOrganizationData(req.params.slug_id)
      .then(function(organization) {
        res.status(200).json(organization)
      })
      .catch(function(error) {
        next(error);
      });
  });
};
