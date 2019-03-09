'use strict';

angular
    .module('jobPortalApp')
    .directive('performanceListing',
        function () {
            return {
                restrict: 'E',
                templateUrl: '../templates/performance-listing.html',
                scope: {
                    performance: "="
                },
                link: function (scope, elem, attrs) {

                }
            };
        }
    );