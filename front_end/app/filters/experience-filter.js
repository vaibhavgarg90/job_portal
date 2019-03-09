'use strict';

angular
    .module('jobPortalApp')
    .filter('experience',
        function () {
            return function (experience) {

                if (!experience) {
                    return "N/A";
                }

                if (experience < 12) {
                    return experience + " M";
                }

                return (experience / 12) + " Y" + (experience % 12) + " M";

            }
        }
    );