'use strict';

angular
    .module('jobPortalApp')
    .filter('properCase',
        function () {
            return function (input) {

                if (!input) {
                    return "";
                }

                return input.toLowerCase().replace(/\b\w/g, function (char) {
                    return char.toUpperCase()
                });
            }
        }
    );