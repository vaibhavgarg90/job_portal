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

                function toFixed(num, fixed) {
                    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
                    return num.toString().match(re)[0];
                }

                return toFixed((ctc / 100000), 2) + " LPA";

            }
        }
    );