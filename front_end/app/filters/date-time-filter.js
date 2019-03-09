'use strict';

angular
    .module('jobPortalApp')
    .filter('dateTime',
        ['$filter', function ($filter) {
            return function (timestamp) {

                if (!timestamp) {
                    return "";
                }

                return $filter('date')(timestamp, 'medium');
            }
        }]
    );