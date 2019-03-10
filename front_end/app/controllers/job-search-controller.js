'use strict';

angular
    .module('jobPortalApp')
    .controller('JobSearchCtrl',
        ['$scope', '$location', 'api', 'modals', function ($scope, $location, api, modals) {

            function handleServerError(err) {
                $scope.loading = false;
                modals.showError(err);
            }

            function getSelectedJob() {
                var selected = null;

                angular.forEach($scope.jobs || [], function (job) {
                    if (job.selected) {
                        selected = job;
                    }
                });

                return selected;
            }

            function fetchCandidates() {
                var selected = getSelectedJob();
                if (selected && selected.id) {
                    $scope.getCandidates(selected.id);
                }
            }

            $scope.setCandidateView = function (view) {
                $scope.candidateView = view;
                fetchCandidates();
            };

            $scope.getJobSuggestions = function (searchText) {
                return api.getJobSuggestions(searchText);
            };

            function getUserDetails() {
                $scope.loading = true;

                api.getUserDetails()
                    .then(
                        function (user) {
                            $scope.user = user;
                            $scope.loading = false;
                        },
                        handleServerError);
            }

            $scope.logout = function () {
                $scope.loading = true;
                api.logout()
                    .then(function () {
                        $location.path('login');
                        $scope.loading = false;
                    }, handleServerError);
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

            function getShortlistedCandidates(jobId) {
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
            }

            function getRejectedCandidates(jobId) {
                $scope.candidates = [];
                $scope.performance = [];
                $scope.loading = true;

                api.getRejectedCandidates(jobId)
                    .then(
                        function (candidates) {
                            $scope.candidates = candidates;
                            $scope.loading = false;
                        },
                        handleServerError);
            }

            function getPendingCandidates(jobId) {
                $scope.candidates = [];
                $scope.performance = [];
                $scope.loading = true;

                api.getPendingCandidates(jobId)
                    .then(
                        function (candidates) {
                            $scope.candidates = candidates;
                            $scope.loading = false;
                        },
                        handleServerError);
            }

            $scope.getCandidates = function (jobId) {
                if (!jobId) {
                    return;
                }

                switch ($scope.candidateView) {
                    case 'SHORTLIST':
                        getShortlistedCandidates(jobId);
                        break;
                    case 'REJECT':
                        getRejectedCandidates(jobId);
                        break;
                    default:
                        getPendingCandidates(jobId);
                }
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

            $scope.updatePerformance = function (jobId, intervieweeId, interviewRound, result) {
                if (!jobId || !intervieweeId || !interviewRound || !result) {
                    return;
                }

                $scope.loading = true;

                api.updatePerformance(jobId, intervieweeId, interviewRound, result)
                    .then(
                        function (updatedPerformance) {
                            $scope.loading = false;
                            $scope.getCandidates(jobId);
                        },
                        handleServerError);
            };

            $scope.reset = function () {
                $scope.status = null;
                $scope.title = null;
            };

            var init = function () {
                getUserDetails();
                $scope.setCandidateView('SHORTLIST');
            };
            init();

        }]
    );