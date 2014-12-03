var app = angular.module('polls')

app.controller('pollControl', function(socket, poll, $scope, $location, $routeParams, pollService, $rootScope){
	var id = poll.data._id;
	$scope.thePollId = poll.data._id;
	$scope.poll = pollService.getPoll({pollId: $routeParams.pollId});
	$scope.poll = {};
	$scope.singlePoll = poll.data;
	$rootScope.singlePoll = poll.data;

console.log("this is poll " + $scope.thePollId)
 $scope.myModel = {
              Name: JSON.stringify('$scope.singlePoll.question')
              // ImageUrl: 'http://www..jpg',
              // FbLikeUrl: 'http://www.incredipoll.com/polls/' + $scope.thePollId
              
          };

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



	$scope.getPoll = function(id) {
		pollService.getPoll(id).then(function(){
		})
	};


});

//Next Step: have client leave mainroom and join
//a poll room. From there, setup socket events on 
//vote function and get poll function