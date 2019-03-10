'use strict';

angular
    .module('jobPortalApp')
    .factory('api',
        ['$http', '$q', '$timeout', function ($http, $q, $timeout) {

            var apiPath = "http://localhost:3000/api/";

            function processServerError(err) {
                var errMsg = "Internal Server Error";

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
                }

                return errMsg;
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
                            var data = resp && resp.data ? resp.data : resp;
                            deferred.resolve(data);
                        },
                        function (err) {
                            deferred.reject(processServerError(err));
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
                            var data = resp && resp.data ? resp.data : resp;
                            deferred.resolve(data);
                        },
                        function (err) {
                            deferred.reject(processServerError(err));
                        });

                return deferred.promise;
            }

            function login(username, password) {
                return postJson("users", "login", {"username": username, "password": password});
            }

            function getUserDetails() {
                return get("users", "details");
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

            function getRejectedCandidates(jobId) {
                var path = jobId + "/reject";
                return get("Jobs", path);
            }

            function getPendingCandidates(jobId) {
                var path = jobId + "/pending";
                return get("Jobs", path);
            }

            function getIntervieweePerformance(jobId, intervieweeId) {
                return get("Interviews", "performance", {"jobId": jobId, "intervieweeId": intervieweeId});
            }

            function updatePerformance(jobId, intervieweeId, interviewRound, result) {
                var data = {
                    "jobId": jobId,
                    "intervieweeId": intervieweeId,
                    "round": interviewRound,
                    "result": result
                };
                return postJson("Interviews", "performance/update", data);
            }

            function logout() {
                return postJson("users", "logout");
            }

            return {
                login: login,
                getUserDetails: getUserDetails,
                getJobSuggestions: getJobSuggestions,
                searchJobs: searchJobs,
                getShortlistedCandidates: getShortlistedCandidates,
                getRejectedCandidates: getRejectedCandidates,
                getPendingCandidates: getPendingCandidates,
                getIntervieweePerformance: getIntervieweePerformance,
                updatePerformance: updatePerformance,
                logout: logout
            };
        }]
    );
