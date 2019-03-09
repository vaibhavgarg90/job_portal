'use strict';

angular
    .module('jobPortalApp')
    .factory('modals',
        ['$uibModal', function ($uibModal) {

            function showError(err) {
                var ModalController = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.err = err;

                    $scope.close = function () {
                        $uibModalInstance.close();
                    };
                }];

                return $uibModal.open({
                    templateUrl: '../templates/error-message-modal.html',
                    controller: ModalController
                });
            }

            return {
                showError: showError
            };

        }]
    );