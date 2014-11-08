var app = angular.module('polls')

app.controller('pollControl', function(poll, $scope, $location, $routeParams, pollService, $rootScope){
	var id = poll.data._id;
	$scope.poll = pollService.getPoll({pollId: $routeParams.pollId});
	$scope.poll = {};

$scope.vote = function(option) {
	
	option.votes++;
	pollService.castVote(id, option)
	.then(function (res) {
		console.log(res);
		$rootScope.$broadcast('updateUser')
		$location.path('/polls/' + id + '/stats')
	})
	}
	

	$scope.singlePoll = poll.data;



	$scope.getPoll = function(id) {
		pollService.getPoll(id).then(function(){
		})
	};


});