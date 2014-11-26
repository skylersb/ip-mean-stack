var app = angular.module('polls')

app.controller('statsControl', function($rootScope, $scope, $routeParams, $location, socket, poll, pollService){
	$scope.poll = pollService.getPoll({pollId: $routeParams.pollId});
	
  // when new vote comes in refresh stats using socket.on

	$scope.poll = {};
	$scope.singlePoll = poll.data;

$scope.addVote = function(){
	$scope.singlePoll.pollOptions[0].votes++;
	console.log($scope.singlePoll)
	
}

	socket.emit('joinRoom', $routeParams.pollId );

socket.on('voted', function(){
	pollService.getPoll($routeParams.pollId)
	.then(function(data){
		$scope.singlePoll = data.data;
		$rootScope.$broadcast('updateGraph', $scope.singlePoll.pollOptions)
	})
	
});

});