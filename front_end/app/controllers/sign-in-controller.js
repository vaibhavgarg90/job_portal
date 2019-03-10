'use strict';

angular
    .module('jobPortalApp')
    .controller('SignInCtrl',
        ['$scope', '$cookies', '$location', 'api', 'modals', function ($scope, $cookies, $location, api, modals) {

            function handleServerError(err) {
                $scope.loading = false;
                modals.showError(err);
            }

            $scope.isSignInEnabled = function () {
                return ($scope.email && $scope.password);
            };

            $scope.signIn = function () {
                if (!$scope.isSignInEnabled()) {
                    return;
                }

                $scope.loading = true;

                api.login($scope.email, $scope.password)
                    .then(
                        function (accessToken) {
                            $location.path('search');
                            $scope.loading = false;
                        },
                        handleServerError);
            };

            $scope.reset = function () {
                $scope.email = null;
                $scope.password = null;
            };
        }]
    );
