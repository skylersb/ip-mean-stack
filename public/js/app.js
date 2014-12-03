var app = angular.module('polls', ['ngRoute', 'ngSanitize', 'angulike', 'ngResource', 'ngCookies'])

app.run([
      '$rootScope', function($rootScope) {
          $rootScope.facebookAppId = '380054328825864';
      }
  ]);

// app.run(function (userService, $rootScope, $location) {
// 		$rootScope.$on("$routeChangeStart", function () {
// 		var user = userService.getUser();
// 			if(user){
// 				$rootScope.user = user;
// 			} else {
// 				$location.path('/login');
// 			}	
// 	});
// });


app.config(function($routeProvider, $httpProvider){
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $httpProvider.interceptors.push('myHttpInterceptor');

	//router here
	$routeProvider
	.when('/polls', {
		templateUrl: 'views/list.html',
		controller: 'mainControl'
	})
	.when('/profile', {
		templateUrl: 'views/profile.html',
		controller: 'profileControl'
	})
	.when('/login', {
		templateUrl: 'views/login.html',
		controller: 'loginControl'
	})
	// .when('/home/:user', {
	// 	templateUrl: 'views/list.html',
	// 	controller: 'mainControl',
	// 	resolve: 
	// 	{
	// 		user: function(userService, $route){
	// 			return userService.getFacebookUser($route.current.params.user);
	// 		}
	// 	}
	// })
	.when('/polls/:pollId', {
		templateUrl: 'views/poll.html',
		controller: 'pollControl',
		resolve: {
			poll: function(pollService, $route) {
				return pollService.getPoll($route.current.params.pollId)
			}
		}
	})
	//create a /poll/:pollid/stats route that grabs the answers and sends them to your ctrler in a resolve
	.when('/polls/:pollId/stats', {
		templateUrl: 'views/stats.html',
		controller: 'statsControl',
		resolve: {
			poll: function(pollService, $route) {
				return pollService.getPoll($route.current.params.pollId)
			}
		}
	})
	.otherwise({
		redirectTo: '/login'
	})
 
});

app.factory('myHttpInterceptor', function($q, $location) {
  // $httpProvider.interceptors.push(function($q, $location) {
    return {
      'responseError': function(rejection) {
        if (rejection.status === 401) {
          $location.path('/login');
        }
        return $q.reject(rejection);
      }
    
  }
})