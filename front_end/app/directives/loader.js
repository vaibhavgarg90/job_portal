'use strict';

angular
    .module('jobPortalApp')
    .directive('loader',
        function () {
            return {
                restrict: 'E',
                link: function (scope, elem, attrs) {

                    var body = $('body');
                    var content = $('#job-portal-app');
                    var modal = $('.modal');

                    var loaderUrl = '../loader.gif';
                    var loader = "<img id='loader' class='loader' src='" + loaderUrl + "'/>";

                    body.append(loader);

                    if (content) {
                        content.css("opacity", "0.5");
                    }


                    if (modal) {
                        modal.css("opacity", "0.5");
                    }

                    scope.$on('$destroy', function () {
                        var loader = $('#loader');
                        loader.remove();

                        if (content) {
                            content.css("opacity", "1");
                        }

                        if (modal) {
                            modal.css("opacity", "1");
                        }
                    });

                }
            };
        });
