var app = angular.module('polls')
app.service('pollService', function($http, $q) {
	
	this.getPolls = function(){
		return $http({
			method: 'GET',
			url: '/polls',
		}).then(function(res){
			console.log(res.data);
			return res.data;
		})
	}

	this.addPoll = function(poll) {
		
		return $http({
			method: 'POST',
			url: '/polls',
			data: poll
		})
	}

	this.getPoll = function(id) {
	return $http({
		method: 'GET',
		url: '/polls/' + id
	})
}

	this.castVote = function(id, option){
		return $http ({
			method: 'PUT',
			url: '/vote/' + id,
			data: option
		}).then(function(res) {
			console.log(res.data)
			return res.data
		})
	}

});
