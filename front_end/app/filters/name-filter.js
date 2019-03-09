'use strict';

angular
    .module('jobPortalApp')
    .filter('name',
        function () {
            return function (user) {

                if (!user) {
                    return "";
                }

                var name = "";

                if (user.firstName) {
                    name += user.firstName;
                }

                if (user.lastName) {
                    if (name) {
                        name += " ";
                    }
                    name += user.lastName;
                }

                return name;
            }
        }
    );