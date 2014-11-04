var app = angular.module('polls', ['ngRoute', 'ngResource'])

app.config(function($routeProvider, $httpProvider){

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
		redirectTo: '/polls'
	})


});