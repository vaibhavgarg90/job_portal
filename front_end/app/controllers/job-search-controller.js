'use strict';

angular
    .module('jobPortalApp')
    .controller('JobSearchCtrl',
        ['$scope', '$log', 'api', 'modals', function ($scope, $log, api, modals) {

            function handleServerError(err) {
                $scope.loading = false;
                modals.showError(err);
            }

            function getUserDetails() {
                $scope.user = api.getLoggedInUser();
            }

            $scope.getJobSuggestions = function (searchText) {
                return api.getJobSuggestions(searchText);
            };

            $scope.isSearchEnabled = function () {
                return ($scope.status || $scope.title);
            };

            $scope.searchJobs = function () {
                if (!$scope.isSearchEnabled()) {
                    return;
                }

                $scope.jobs = [];
                $scope.candidates = [];
                $scope.performance = [];
                $scope.loading = true;

                api.searchJobs($scope.title, $scope.status)
                    .then(
                        function (jobs) {
                            $scope.jobs = jobs;
                            $scope.loading = false;
                        },
                        handleServerError);
            };

            $scope.getCandidates = function (jobId) {
                if (!jobId) {
                    return;
                }

                $scope.candidates = [];
                $scope.performance = [];
                $scope.loading = true;

                api.getShortlistedCandidates(jobId)
                    .then(
                        function (candidates) {
                            $scope.candidates = candidates;
                            $scope.loading = false;
                        },
                        handleServerError);
            };

            $scope.getPerformance = function (jobId, intervieweeId) {
                if (!jobId || !intervieweeId) {
                    return;
                }

                $scope.loading = true;

                api.getIntervieweePerformance(jobId, intervieweeId)
                    .then(
                        function (performance) {
                            $scope.performance = performance;
                            $scope.loading = false;
                        },
                        handleServerError);
            };

            $scope.reset = function () {
                $scope.status = null;
                $scope.title = null;
            };

            var init = function () {
                getUserDetails();
            };
            init();

        }]
    );