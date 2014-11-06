var app = angular.module('polls');

app.service('userService', function($http, $q, $cookieStore, $location){

	this.getUser = function() {
		console.log($cookieStore.get('user'));
		return $cookieStore.get('user');
	};

	this.setUser = function(){
		 	return $http ({
		 		method: 'GET',
		 		url: '/me'
		 	}).then(function(res){
		 		debugger;
		 		var fbUser = res.data;
		 		$cookieStore.put('user', fbUser);
		 	})
		}
});