'use strict';

var Promise = require('bluebird');

module.exports = function (Interview) {

  Interview.getShortListedCandidates = function (jobId) {
    if (!jobId) {
      var err = new Error("Job id is not specified.");
      err.statusCode = 422;
      return Promise.reject(err);
    }

    var query = {
      "where": {
        "jobId": jobId,
        "result": "OFFERED"
      },
      "include": {
        "relation": "interviewee"
      }
    };

    return Interview.find(query)
      .then(function (shortlisted) {
        return shortlisted;
      })
      .catch(function (err) {
        return err;
      });
  };

  Interview.getPerformance = function (jobId, intervieweeId, callback) {
    var err;

    if (!jobId) {
      err = new Error("Job id is not specified.");
      err.statusCode = 422;
      callback(err);
      return;
    }

    if (!intervieweeId) {
      err = new Error("Interviewee id is not specified.");
      err.statusCode = 422;
      callback(err);
      return;
    }

    var query = {
      "where": {
        "jobId": jobId,
        "intervieweeId": intervieweeId
      },
      "include": {
        "relation": "interviewer"
      }
    };

    Interview.find(query)
      .then(function (interviews) {
        callback(null, interviews);
      })
      .catch(function (err) {
        err.statusCode = err.statusCode || 500;
        callback(err);
      });
  };

  Interview.remoteMethod('getPerformance', {
    http: {
      path: '/performance',
      verb: 'get'
    },
    accepts: [{
      arg: 'jobId',
      type: 'string',
      required: true
    }, {
      arg: 'intervieweeId',
      type: 'string',
      required: true
    }],
    returns: {
      arg: 'interviews',
      type: 'array',
      root: true
    },
    description: 'Returns an array of all the interviews of a interviewer for specified job.'
  });

  Interview.disableRemoteMethodByName('deleteById');

};
