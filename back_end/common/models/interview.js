'use strict';

var Promise = require('bluebird');
var logger = require('../../server/logger');

module.exports = function (Interview) {

  Interview.getCandidates = function (jobId, result) {
    var err;

    if (!jobId) {
      err = new Error("Job id is not specified.");
      err.statusCode = 422;
      console.log(err);
      logger.error(err);
      return Promise.reject(err);
    }

    if (!result) {
      err = new Error("Result is not specified.");
      err.statusCode = 422;
      console.log(err);
      logger.error(err);
      return Promise.reject(err);
    }

    var query = {
      "where": {
        "jobId": jobId,
        "result": result
      },
      "include": {
        "relation": "interviewee",
        scope: {
          "include": {
            "relation": "company"
          }
        }
      }
    };

    return Interview.find(query)
      .then(function (shortlisted) {
        return shortlisted;
      })
      .catch(function (err) {
        console.log(err);
        logger.error(err);
        return err;
      });
  };

  Interview.getShortListedCandidates = function (jobId) {
    return Interview.getCandidates(jobId, "OFFERED");
  };

  Interview.getRejectedCandidates = function (jobId) {
    return Interview.getCandidates(jobId, "REJECTED");
  };

  Interview.getPendingCandidates = function (jobId) {
    return Interview.getCandidates(jobId, "PENDING");
  };

  Interview.getPerformance = function (jobId, intervieweeId, callback) {
    var err;

    if (!jobId) {
      err = new Error("Job id is not specified.");
      err.statusCode = 422;
      console.log(err);
      logger.error(err);
      callback(err);
      return;
    }

    if (!intervieweeId) {
      err = new Error("Interviewee id is not specified.");
      err.statusCode = 422;
      console.log(err);
      logger.error(err);
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
        console.log(err);
        logger.error(err);
        callback(err);
      });
  };

  Interview.updatePerformance = function (params, callback) {
    var err;

    if (!params) {
      err = new Error("Params is not specified.");
      err.statusCode = 422;
      console.log(err);
      logger.error(err);
      callback(err);
      return;
    }

    if (!params.jobId) {
      err = new Error("Job id is not specified.");
      err.statusCode = 422;
      console.log(err);
      logger.error(err);
      callback(err);
      return;
    }

    if (!params.intervieweeId) {
      err = new Error("Interviewee id is not specified.");
      err.statusCode = 422;
      console.log(err);
      logger.error(err);
      callback(err);
      return;
    }

    if (!params.round) {
      err = new Error("Round is not specified.");
      err.statusCode = 422;
      console.log(err);
      logger.error(err);
      callback(err);
      return;
    }

    if (!params.result) {
      err = new Error("Result is not specified.");
      err.statusCode = 422;
      console.log(err);
      logger.error(err);
      callback(err);
      return;
    }

    var query = {
      "where": {
        "jobId": params.jobId,
        "intervieweeId": params.intervieweeId,
        "round": params.round
      },
      "include": {
        "relation": "interviewee"
      }
    };

    Interview.findOne(query)
      .then(function (interviewDetails) {
        if (!interviewDetails) {
          err = new Error('Interview details not found.');
          err.statusCode = 500;
          console.log(err);
          logger.error(err);
          callback(err);
          return;
        }

        return interviewDetails.updateAttributes({"result": params.result});
      })
      .then(function (updatedInterviewDetails) {
        if (!updatedInterviewDetails) {
          err = new Error('Interview details not found.');
          err.statusCode = 500;
          console.log(err);
          logger.error(err);
          callback(err);
          return;
        }

        callback(null, updatedInterviewDetails);
      })
      .catch(function (err) {
        err.statusCode = 500;
        console.log(err);
        logger.error(err);
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
      arg: 'performances',
      type: 'array',
      root: true
    },
    description: 'Returns an array of all the interviews of a interviewee for specified job.'
  });

  Interview.remoteMethod('updatePerformance', {
    http: {
      path: '/performance/update',
      verb: 'post'
    },
    accepts: [{
      arg: 'params',
      type: 'object',
      required: true,
      http: {
        source: 'body'
      }
    }],
    returns: {
      arg: 'performance',
      type: 'object',
      root: true
    },
    description: 'Update the status of a pending round of a interviewee for specified job.'
  });

  Interview.disableRemoteMethodByName('deleteById');

};
