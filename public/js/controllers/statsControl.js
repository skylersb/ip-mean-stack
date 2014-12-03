var app = angular.module('polls')

app.controller('statsControl', function($rootScope, $scope, $routeParams, $location, socket, poll, pollService){
	
	var id = poll.data._id;
	$scope.thePollId = poll.data._id;
	$scope.poll = pollService.getPoll({pollId: $routeParams.pollId});
	$scope.poll = {};
	$scope.singlePoll = poll.data;

console.log("this is poll " + $scope.singlePoll.question)
 $scope.myModel = {
              Name: "Does this change?",
              // ImageUrl: 'http://www..jpg',
              // FbLikeUrl: 'http://www.incredipoll.com/#/polls/' + $scope.thePollId + '/stats'
              FbLikeUrl: 'http://www.incredipoll.com/polls/' + $scope.thePollId + '/stats'
              // FbLikeUrl: 'http://10.0.0.210:3000/polls/' + $scope.thePollId + '/stats'
          };
         
  // when new vote comes in refresh stats using socket.on



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