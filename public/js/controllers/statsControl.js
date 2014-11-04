var app = angular.module('polls')

app.controller('statsControl', function($scope, $routeParams, $location, poll, pollService, authService){
	$scope.poll = pollService.getPoll({pollId: $routeParams.pollId});
	
	$scope.poll = {};
	$scope.singlePoll = poll.data;
});