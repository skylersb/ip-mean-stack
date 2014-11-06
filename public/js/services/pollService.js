var app = angular.module('polls')
app.service('pollService', function($http, $q) {
	
	this.getPolls = function(){
		return $http({
			method: 'GET',
			url: 'http://localhost:3000/polls',
		}).then(function(res){
			return res.data;
		})
	}

	this.addPoll = function(poll) {
		
		return $http({
			method: 'POST',
			url: 'http://localhost:3000/polls',
			data: poll
		})
	}

	this.getPoll = function(id) {
	return $http({
		method: 'GET',
		url: 'http://localhost:3000/polls/' + id
	})
}

	this.castVote = function(id, option){
		return $http ({
			method: 'PUT',
			url: 'http://localhost:3000/vote/' + id,
			data: option
		}).then(function(res) {
			console.log(res)
			return res.data
		})
	}

});
