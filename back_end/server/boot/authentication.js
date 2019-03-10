'use strict';

var logger = require('../logger');
var util = require('util');

module.exports = function enableAuthentication(server) {
  server.enableAuth({datasource: 'db'});

  function isExcluded(req) {
    //console.log('req :: ' + util.inspect(req));
    //logger.debug('req :: ' + util.inspect(req));

    var path = req.path.toLowerCase();
    var method = req.method.toLowerCase();

    console.log('Checking :: ' + method + ' :: ' + path);
    console.log('Checking :: ' + method + ' :: ' + path);

    if (method === 'post' && path.match(/^\/api\/users\/signup/)) {
      return true;
    }

    if (method === 'post' && path.match(/^\/api\/users\/login/)) {
      return true;
    }

    if (method === 'post' && path.match(/^\/api\/users\/logout/)) {
      return true;
    }

    if (method === 'get' && path.match(/^\/api\/companies/)) {
      return true;
    }

    return false;
  }

  function getExpiry(accessTokenDetails) {
    return (new Date(accessTokenDetails.created).getTime() + (accessTokenDetails.ttl * 1000));
  }

  function validate(accessToken) {
    return server.models.AccessToken.findById(accessToken)
      .then(function (accessTokenDetails) {
        if (!accessTokenDetails) {
          return false;
        }

        //console.log('Access token details :: ' + JSON.stringify(accessTokenDetails));
        //logger.debug('Access token details :: ' + JSON.stringify(accessTokenDetails));

        var expiry = getExpiry(accessTokenDetails);

        if (expiry < new Date()) {
          return null;
        }

        return accessTokenDetails;
      })
      .catch(function (err) {
        console.log(err);
        logger.error(err);
        return null;
      });
  }

  function authenticate(req, res, next) {
    if (!req) {
      return next();
    }

    if (isExcluded(req)) {
      return next();
    }

    var errMsg;

    var accessToken = req.headers['x-access-token'] || req.headers['X-Access-Token'] || req.query['access_token'];

    console.log('Access Token :: ' + accessToken);
    logger.debug('Access Token :: ' + accessToken);

    if (!accessToken) {
      errMsg = 'Authentication required';
      console.log(errMsg);
      logger.error(errMsg);

      res
        .status(401)
        .send(errMsg);
    } else {
      validate(accessToken)
        .then(function (accessTokenDetails) {
          if (!accessTokenDetails) {
            errMsg = 'Invalid access token';
            console.log(errMsg);
            logger.error(errMsg);

            res
              .status(401)
              .send(errMsg);
          } else {
            console.log('User id :: ' + accessTokenDetails.userId);
            logger.debug('User id :: ' + accessTokenDetails.userId);
            req.headers['x-authenticated-user'] = accessTokenDetails.userId;
            return next();
          }
        })
        .catch(function (err) {
          console.log(err);
          logger.error(err);

          res
            .status(500)
            .send(err);
        });
    }
  }

  server.use(authenticate);
};
