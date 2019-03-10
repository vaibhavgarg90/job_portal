'use strict';

angular
    .module('jobPortalApp')
    .config(['$routeProvider', '$httpProvider',
        function ($routeProvider, $httpProvider) {
            $routeProvider
                .when('/login', {
                    templateUrl: 'templates/sign-in.html'
                })
                .when('/search', {
                    templateUrl: 'templates/job-search.html'
                })
                .otherwise('/search');

            $httpProvider.interceptors.push(['$rootScope', '$cookies', '$q',
                function ($rootScope, $cookies, $q) {
                    return {
                        request: function (config) {
                            config.headers['x-access-token'] = $cookies.get('accessToken');
                            return config || $q.when(config);
                        },
                        response: function (resp) {
                            if (resp && resp.config && resp.data) {
                                var method = resp.config.method.toLowerCase();
                                var url = resp.config.url.toLowerCase();

                                if (method === 'post' && url.indexOf('/login') > -1) {
                                    var data = resp.data;
                                    var accessToken = data.id;
                                    var created = data.created;
                                    var ttl = data.ttl;
                                    var userId = data.userId;

                                    var expires;

                                    if (created && ttl) {
                                        var dt = new Date(created);
                                        expires = new Date(dt.getTime() + (ttl * 1000));
                                    }

                                    $cookies.put('accessToken', accessToken, {
                                        expires: expires
                                    });

                                    $cookies.put('userId', userId, {
                                        expires: expires
                                    });
                                }
                            }

                            return resp;
                        },
                        responseError: function (resp) {
                            switch (resp.status) {
                                case 401:
                                    $rootScope.$broadcast('login');
                                    break;
                            }
                            return $q.reject(resp);
                        }
                    };
                }
            ]);
        }
    ])
    .run(['$rootScope', '$location',
        function ($rootScope, $location) {
            $rootScope.$on('login', function () {
                $location.path('login');
            });
        }
    ]);
