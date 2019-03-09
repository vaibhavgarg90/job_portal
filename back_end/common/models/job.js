'use strict';

var app = require('../../server/server');

module.exports = function (Job) {

  Job.suggestions = function (searchText, callback) {
    var err;

    if (!searchText) {
      err = new Error("Search text is not specified.");
      err.statusCode = 422;
      callback(err);
      return;
    }

    var pattern = new RegExp(searchText, "i");

    var query = {
      "where": {
        "title": {
          "regexp": pattern
        }
      }
    };

    Job.find(query)
      .then(function (suggestions) {
        callback(null, suggestions);
      })
      .catch(function (err) {
        err.statusCode = err.statusCode || 500;
        callback(err);
      });
  };

  Job.search = function (params, callback) {
    var err;

    if (!params || ((typeof params === "object") && (Object.keys(params).length === 0))) {
      err = new Error("Search param is not specified.");
      err.statusCode = 422;
      callback(err);
      return;
    }

    if (!params.title && !params.status) {
      err = new Error("Either title or status has to be specified.");
      err.statusCode = 422;
      callback(err);
      return;
    }

    var query = {
      "where": {},
      "include": {
        "relation": "company"
      }
    };

    if (params.title) {
      var pattern = new RegExp(params.title, "i");
      query.where.title = {
        "regexp": pattern
      }
    }

    if (params.status) {
      query.where.status = params.status;
    }

    Job.find(query)
      .then(function (jobs) {
        callback(null, jobs);
      })
      .catch(function (err) {
        err.statusCode = err.statusCode || 500;
        callback(err);
      });
  };

  Job.getShortListedCandidates = function (jobId, callback) {
    var Interview = app.models.Interview;

    Interview.getShortListedCandidates(jobId)
      .then(function (shortlisted) {
        callback(null, shortlisted);
      })
      .catch(function (err) {
        err.statusCode = err.statusCode || 500;
        callback(err);
      });
  };

  Job.remoteMethod('suggestions', {
    http: {
      path: '/suggestions',
      verb: 'get'
    },
    accepts: [{
      arg: 'title',
      type: 'string',
      required: true
    }],
    returns: {
      arg: 'suggestions',
      type: 'array',
      root: true
    },
    description: 'Returns the suggestions for the job title.'
  });

  Job.remoteMethod('search', {
    http: {
      path: '/search',
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
      arg: 'jobs',
      type: 'array',
      root: true
    },
    description: 'Search the jobs based on various filters.'
  });

  Job.remoteMethod('getShortListedCandidates', {
    http: {
      path: '/:id/shortlist',
      verb: 'get'
    },
    accepts: [{
      arg: 'id',
      type: 'string',
      required: true
    }],
    returns: {
      arg: 'shortlisted',
      type: 'array',
      root: true
    },
    description: 'Returns an array of shortlisted candidates for given job.'
  });

  Job.disableRemoteMethodByName('deleteById');

};