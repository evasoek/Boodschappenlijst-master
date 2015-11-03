/// <reference path="angular.js" />
var applicatie = angular.module('application', ['ngRoute', 'ngCookies', 'ngResource', 'ngDialog']);

applicatie.config([
        '$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/Views/login.html',
                    controller: 'LoginController'
                })
                .when('/login', {
                    templateUrl: '/Views/login.html',
                    controller: 'LoginController'
                })
                .when('/home', {
                    templateUrl: '/Views/home.html',
                    controller: 'HomeController'
                })
                .when('/groupinfo/:groupId', {
                    templateUrl: '/Views/groupInfo.html',
                    controller: 'GroupInfoController'
                })
                .when('/purchaselist', {
                    templateUrl: '/Views/purchaselist.html',
                    controller: 'PurchaseListController'
                })
                .when('/account', {
                    templateUrl: '/Views/account.html',
                    controller: 'AccountController'
                });
        }
    ])
    .run([
        '$rootScope', '$location', '$http', 'access',
        function($rootScope, $location, $http, access) {
            $rootScope.Logout = function() {
                access.Logout();
            }

            $rootScope.$on("$routeChangeStart", function(event, next) {
                $http.defaults.headers.common.Authorization = access.GetKey();

                $rootScope.loggedIn = access.IsLoggedIn();

                if ($rootScope.loggedIn == false) {
                    if (next.templateUrl == "/Views/login.html") {
                    } else {
                        $location.path("/login");
                    }
                } else {
                    if (next.templateUrl == "/Views/login.html") {
                        $location.path("/home");
                    }
                }
            });
        }
    ])
    .filter('customCurrency', ["$filter", function ($filter) {       
        return function(amount, currencySymbol){
            var currency = $filter('currency');         

            if(amount < 0){
                return currency(amount, currencySymbol).replace("(", "-").replace(")", ""); 
            }

            return currency(amount, currencySymbol);
        };
    }])
    .factory('access', [
        '$window', '$location',
        function ($window, $location) {
            return {
                GetKey: function() {
                    return $window.sessionStorage.getItem("auth");
                },

                SetKey: function(key) {
                    if (key == "null") $window.sessionStorage.removeItem("auth");
                    else $window.sessionStorage.setItem("auth", key);
                },

                GetUser: function() {
                    return $window.sessionStorage.getItem("username");
                },

                SetUser: function(username) {
                    if (username == "null") $window.sessionStorage.removeItem("username");
                    else $window.sessionStorage.setItem("username", username);
                },

                IsLoggedIn: function() {
                    return (this.GetUser() != null && this.GetKey() != null);
                },

                Login: function() {
                    if (this.IsLoggedIn()) $location.path("/home");
                },

                Logout: function () {
                    this.SetKey("null");
                    this.SetUser("null");
                    $location.path("/login");
                }
            };
        }
    ]);
