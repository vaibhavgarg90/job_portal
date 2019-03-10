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

                var text = "";

                var years = Math.floor(experience / 12);
                text += years + " Y";

                var months = (experience % 12);

                if (months) {
                    text += " " + months + " M";
                }

                return text;
            }
        }
    );