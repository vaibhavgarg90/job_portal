'use strict';

var logger = require('../../server/logger');

module.exports = function (User) {

  User.signup = function (params, callback) {
    var err;

    if (!params) {
      err = new Error('User details not specified');
      err.statusCode = 422;
      console.log(err);
      logger.error(err);
      callback(err);
      return;
    }

    params.realm = params.realm || 'web';

    User.create(params)
      .then(function (userDetails) {
        if (!userDetails) {
          err = new Error('Internal Server Error');
          err.statusCode = 500;
          console.log(err);
          logger.error(err);
          callback(err);
          return;
        }

        callback(null, userDetails);
      })
      .catch(function (err) {
        err.statusCode = 500;
        console.log(err);
        logger.error(err);
        callback(err);
      });
  };

  User.details = function (authUserId, callback) {
    var err;

    if (!authUserId) {
      err = new Error('Authentication required');
      err.statusCode = 401;
      console.log(err);
      logger.error(err);
      callback(err);
      return;
    }

    var query = {
      "where": {
        "id": authUserId
      },
      "include": {
        "company": true
      }
    };

    User.findOne(query)
      .then(function (userDetails) {
        callback(null, userDetails);
      })
      .catch(function (err) {
        err.statusCode = 500;
        console.log(err);
        logger.error(err);
        callback(err);
      });
  };

  User.remoteMethod('signup', {
      http: {
        path: '/signup',
        verb: 'post'
      },
      accepts: [{
        arg: 'params',
        type: "object",
        http: {
          source: 'body'
        }
      }],
      returns: {
        arg: 'userDetails',
        type: 'object',
        root: true
      }
    }
  );

  User.remoteMethod('details', {
      http: {
        path: '/details',
        verb: 'get'
      },
      accepts: [{
        arg: 'x-authenticated-user',
        type: "string",
        http: {
          source: 'header'
        }
      }],
      returns: {
        arg: 'userDetails',
        type: 'object',
        root: true
      }
    }
  );

  User.disableRemoteMethodByName('deleteById');

};
