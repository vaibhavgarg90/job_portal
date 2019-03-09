'use strict';

angular
    .module('jobPortalApp')
    .filter('ctc',
        function () {
            return function (ctc) {

                if (!ctc) {
                    return "N/A";
                }

                if (ctc < 100000) {
                    return ctc;
                }

                return (ctc / 100000) + "LPA";

            }
        }
    );