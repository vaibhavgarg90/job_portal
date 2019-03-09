'use strict';

angular
    .module('jobPortalApp')
    .directive('jobListing',
        function () {
            return {
                restrict: 'E',
                templateUrl: '../templates/job-listing.html',
                scope: {
                    jobs: "=",
                    loading: "=",
                    onSelect: "&"
                },
                link: function (scope, elem, attrs) {

                    var destroyJobWatcher;

                    function selectJob(job) {
                        angular.forEach(scope.jobs || [], function (item) {
                            if (item.id === job.id) {
                                item.selected = true;
                            } else {
                                item.selected = false;
                            }
                        });
                    }

                    scope.searchCandidates = function (job) {
                        selectJob(job);
                        scope.onSelect({jobId: job.id});
                    };

                    function initWatchers() {
                        destroyJobWatcher = scope.$watch('jobs', function (jobs) {
                            if (jobs && jobs.length) {
                                var selected = jobs[0];
                                scope.searchCandidates(selected);
                            }
                        });

                        scope.$on('$destroy', function () {
                            destroyJobWatcher();
                        });
                    }

                    var init = function () {
                        initWatchers();
                    };
                    init();
                }
            };
        }
    );