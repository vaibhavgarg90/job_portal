'use strict';

angular
    .module('jobPortalApp')
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/search', {
                    templateUrl: 'templates/job-search.html'
                })
                .otherwise('/search');
        }
    ]);