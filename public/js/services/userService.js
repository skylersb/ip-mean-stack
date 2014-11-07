var app = angular.module('polls');

app.service('userService', function($http, $q, $cookieStore, $location){

	this.getUser = function() {
		return $cookieStore.get('pollUser');
	};

	this.setUser = function(){
		 	return $http ({
		 		method: 'GET',
		 		url: '/me'
		 	});
		}
});