var app = angular.module('polls');

app.controller('loginControl', function($scope, $location, userService){
	
	$scope.fbLogin = function(){
		$location.path("/auth/facebook");
	}


$scope.fbLogOut = function(){
	$location.path('/logout')
}

});