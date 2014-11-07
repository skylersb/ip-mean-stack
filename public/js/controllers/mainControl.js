var app = angular.module('polls')

app.controller('mainControl', function($scope, pollService, $location, userService, $cookieStore){
// userService.setUser().then(function () {
// 	$scope.user = userService.getUser();
// })
// $scope.polls = pollService.query();
$scope.polls = [];

$scope.poll = {
	question: '',
	pollOptions: [{text: ''}, {text: ''}]
};

$scope.addOption = function(){
	$scope.poll.pollOptions.push({text: ''})
};

$scope.removeOption = function(){

	$scope.poll.pollOptions.splice($scope.poll.pollOptions.indexOf(), 1);
}



$scope.getPolls = function(){
	pollService.getPolls().then(function(polls){
		$scope.polls = polls;
	});
}

$scope.testCreatePoll = function() {
	pollService.addPoll($scope.poll)
	$scope.poll = {
	question: '',
	pollOptions: [{text: ''}, {text: ''}]
	};
	$scope.getPolls();
}


$scope.takePoll = function(poll){
			 
			 $location.path('/polls/' + poll._id);	
	}

$scope.viewStats = function(poll){
	$location.path('/polls/' + poll._id + '/stats')
}

$scope.getPolls();

$scope.isUserLoggedIn = true;

$scope.fbLogOut = function(){
	$cookieStore.remove('pollUser');
	$location.path('/logout')
}

});