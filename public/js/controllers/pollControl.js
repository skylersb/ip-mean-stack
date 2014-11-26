var app = angular.module('polls')

app.controller('pollControl', function(socket, poll, $scope, $location, $routeParams, pollService, $rootScope){
	var id = poll.data._id;
	$scope.poll = pollService.getPoll({pollId: $routeParams.pollId});
	$scope.poll = {};


	socket.emit('joinRoom', id + "");

$scope.vote = function(option) {
	
	option.votes++;
	pollService.castVote(id, option)
	.then(function (res) {
		console.log(res);
		$rootScope.$broadcast('updateUser')
		$location.path('/polls/' + id + '/stats')
		$rootScope.$broadcast('updateGraph')
	socket.emit('voted', $routeParams.pollId)
	})
	}
	

	$scope.singlePoll = poll.data;



	$scope.getPoll = function(id) {
		pollService.getPoll(id).then(function(){
		})
	};


});

//Next Step: have client leave mainroom and join
//a poll room. From there, setup socket events on 
//vote function and get poll function