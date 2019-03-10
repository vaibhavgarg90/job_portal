'use strict';

angular
    .module('jobPortalApp')
    .directive('performanceListing',
        function () {
            return {
                restrict: 'E',
                templateUrl: '../templates/performance-listing.html',
                scope: {
                    performance: "=",
                    loading: "=",
                    onUpdateStatus: "&"
                },
                link: function (scope, elem, attrs) {

                    scope.results = ['REJECTED', 'PENDING', 'SELECTED', 'OFFERED'];

                    scope.updateStatus = function (perf) {
                        scope.onUpdateStatus({
                            "jobId": perf.jobId,
                            "intervieweeId": perf.intervieweeId,
                            "interviewRound": perf.round,
                            "result": perf.result
                        });
                    };
                }
            };
        }
    );