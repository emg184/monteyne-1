const queries = require("../queries/categories.js");
const getOrg = require("../queries/organizations.js");
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
  app.get('/api/organizations/:slug_id/categories', function(req, res, next) {
    getOrg.getOrganizationId(req.params.slug_id)
      .then(function(result) {
        return queries.getOrganizationCategories(result[0].organization_id)
      })
        .then(function(categories) {
          res.status(200).json(categories)
        })
        .catch(function(error) {
          next(error);
        });
  });
  app.get('/api/organizations/:slug_id/:category_name', function(req, res, next) {
    getOrg.getOrganizationId(req.params.slug_id)
      .then(function(result) {
        return queries.getOrganizationCategory(req.params.category_name, result[0].organization_id)
      })
        .then(function(categories) {
          res.status(200).json(categories)
        })
        .catch(function(error) {
          next(error);
        });
  });
  app.post('/api/organizations/:slug_id/categories', requireAuth, function(req, res, next) {
    getOrg.getOrganizationId(req.params.slug_id)
        .then(function(result) {
            return queries.addOrganizationCategory(req.body.name, result[0].organization_id , req.body.status, req.body.image, req.body.description, req.body.primary, req.body.secondary)
        })
          .then(function(categories) {
            res.status(200).json(categories)
          })
            .catch(function(error) {
              next(error);
            });
  });
  app.delete('/api/organizations/:slug_id/categories', requireAuth, function(req, res, next) {
    getOrg.getOrganizationId(req.params.slug_id)
        .then(function(result) {
            return queries.deleteOrganizationCategory(req.body.name, result[0].organization_id)
        })
          .then(function(categories) {
            res.status(200).json(categories)
          })
            .catch(function(error) {
              next(error);
            });
  });
  app.put('/api/organizations/:slug_id/categories', requireAuth, function(req, res, next) {
  getOrg.getOrganizationId(req.params.slug_id)
      .then(function(result) {
          return queries.updateOrganizationCategory(req.body.id, req.body.name, result[0].organization_id , req.body.status, req.body.image, req.body.description, req.body.primary, req.body.secondary)
      })
        .then(function(categories) {
          res.status(200).json(categories)
        })
          .catch(function(error) {
            next(error);
          });
  });
  app.put('/api/organizations/:slug_id/categories/activate', requireAuth, function(req, res, next) {
    getOrg.getOrganizationId(req.params.slug_id)
        .then(function(result) {
            return queries.activateOrganizationCategory(req.body.name, result[0].organization_id)
        })
          .then(function(categories) {
            res.status(200).json(categories)
          })
            .catch(function(error) {
              next(error);
            });
  });
  app.put('/api/organizations/:slug_id/categories/deactivate', requireAuth, function(req, res, next) {
    getOrg.getOrganizationId(req.params.slug_id)
        .then(function(result) {
            return queries.deactivateOrganizationCategory(req.body.name, result[0].organization_id)
        })
          .then(function(categories) {
            res.status(200).json(categories)
          })
            .catch(function(error) {
              next(error);
            });
  });
  app.get('/api/categories/all', function(req, res, next) {
    queries.Categories()
        .then(function(categories) {
          res.status(200).json(categories)
        })
        .catch(function(error) {
          next(error);
        });
  });
};
