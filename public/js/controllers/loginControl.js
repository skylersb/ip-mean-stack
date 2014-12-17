var app = angular.module('polls');

app.controller('loginControl', function($scope, $location, userService, $cookieStore){
	
	$scope.fbLogin = function(){
		$location.path('/auth/facebook');
	}

	$scope.twitterLogin = function(){
		$location.path('/auth/twitter');
	}





});