var app = angular.module('polls')
app.service('pollService', function($http, $q) {
	
	this.getPolls = function(){
		return $http({
			method: 'GET',
			url: 'http://localhost:7000/polls',
		}).then(function(res){
			return res.data;
		})
	}

	this.addPoll = function(poll) {
		
		return $http({
			method: 'POST',
			url: 'http://localhost:7000/polls',
			data: poll
		})
	}

	this.getPoll = function(id) {
	return $http({
		method: 'GET',
		url: 'http://localhost:7000/polls/' + id
	})
}

	this.castVote = function(id, option){
		return $http ({
			method: 'PUT',
			url: 'http://localhost:7000/vote/' + id,
			data: option
		}).then(function(res) {
			console.log(res)
			return res.data
		})
	}

});
