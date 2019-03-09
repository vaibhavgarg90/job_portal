'use strict';

angular
    .module('jobPortalApp')
    .directive('candidateListing',
        function () {
            return {
                restrict: 'E',
                templateUrl: '../templates/candidate-listing.html',
                scope: {
                    candidates: "=",
                    loading: "=",
                    onSelect: "&"
                },
                link: function (scope, elem, attrs) {

                    var destroyCandidateWatcher;

                    function selectCandidate(candidate) {
                        angular.forEach(scope.candidates || [], function (item) {
                            if (item.id === candidate.id) {
                                item.selected = true;
                            } else {
                                item.selected = false;
                            }
                        });
                    }

                    scope.searchPerformance = function (candidate) {
                        selectCandidate(candidate);
                        scope.onSelect({jobId: candidate.jobId, intervieweeId: candidate.intervieweeId});
                    };

                    function initWatchers() {
                        destroyCandidateWatcher = scope.$watch('candidates', function (candidates) {
                            if (candidates && candidates.length) {
                                var selected = candidates[0];
                                scope.searchPerformance(selected);
                            }
                        });

                        scope.$on('$destroy', function () {
                            destroyCandidateWatcher();
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