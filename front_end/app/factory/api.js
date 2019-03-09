'use strict';

angular
    .module('jobPortalApp')
    .factory('api',
        ['$http', '$q', function ($http, $q) {

            var apiPath = "http://localhost:3000/api/";

            function processServerError(err, deferred) {
                var errMsg;

                if (err) {
                    if (err.data) {
                        if (err.data.error) {
                            if (err.data.error.message) {
                                errMsg = err.data.error.message;
                            } else {
                                errMsg = err.data.error;
                            }
                        } else {
                            errMsg = err.data;
                        }
                    } else {
                        errMsg = err;
                    }
                } else {
                    return "Internal Server Error";
                }

                if (deferred) {
                    deferred.reject(errMsg);
                } else {
                    return errMsg;
                }
            }

            function constructUrl(model, path, params) {
                var url = apiPath + model + "/" + path;

                if (params && (typeof params === "object")) {
                    url += "?";

                    var paramCount = 0;

                    angular.forEach(params, function (value, key) {
                        if (key && value) {
                            if (paramCount > 0) {
                                url += "&";
                            }

                            url += key;
                            url += "=";
                            url += value;
                        }

                        paramCount++;
                    });
                }

                return url;
            }

            function get(model, path, params) {
                var deferred = $q.defer();

                $http(
                    {
                        method: "GET",
                        url: constructUrl(model, path, params)
                    })
                    .then(
                        function (resp) {
                            if (resp && resp.data) {
                                deferred.resolve(resp.data);
                            } else {
                                deferred.resolve(resp);
                            }
                        },
                        function (err) {
                            processServerError(err, deferred);
                        });

                return deferred.promise;
            }

            function postJson(model, path, data, params) {
                var deferred = $q.defer();

                $http(
                    {
                        method: "POST",
                        url: constructUrl(model, path, params),
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: data
                    })
                    .then(
                        function (resp) {
                            if (resp && resp.data) {
                                deferred.resolve(resp.data);
                            } else {
                                deferred.resolve(resp);
                            }
                        },
                        function (err) {
                            processServerError(err, deferred);
                        });

                return deferred.promise;
            }

            function getLoggedInUser() {
                return {
                    "firstName": "Venki",
                    "lastName": "Kumar",
                    "company": {
                        "name": "ABC Consultancies",
                        "address": "ABC Road, XYZ"
                    }
                };
            }

            function getJobSuggestions(title) {
                return get("Jobs", "suggestions", {"title": title});
            }

            function searchJobs(title, status) {
                return postJson("Jobs", "search", {"title": title, "status": status});
            }

            function getShortlistedCandidates(jobId) {
                var path = jobId + "/shortlist";
                return get("Jobs", path);
            }

            function getIntervieweePerformance(jobId, intervieweeId) {
                return get("Interviews", "performance", {"jobId": jobId, "intervieweeId": intervieweeId});
            }

            return {
                getLoggedInUser: getLoggedInUser,
                getJobSuggestions: getJobSuggestions,
                searchJobs: searchJobs,
                getShortlistedCandidates: getShortlistedCandidates,
                getIntervieweePerformance: getIntervieweePerformance
            };
        }]
    );