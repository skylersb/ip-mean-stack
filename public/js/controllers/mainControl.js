var app = angular.module('polls')

app.controller('mainControl', function($rootScope, $scope, pollService, $location, userService, $cookieStore){
// userService.setUser().then(function () {
// 	$scope.user = userService.getUser();
// })
// $scope.polls = pollService.query();

$rootScope.user = $cookieStore.get('pollUser');

// console.log($rootScope.user.votedPolls)

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




$scope.getPolls = function(polls){
	pollService.getPolls().then(function(polls){
		$scope.polls = polls;
	
		for(var i = 0; i < $scope.polls.length; i++){
		if($rootScope.user.votedPolls.indexOf($scope.polls[i]._id) > -1){
			$scope.polls[i].pollTaken = true;
		} else {
			$scope.polls[i].pollTaken = false;
		}
	}
	});
	
}
$scope.getPolls();

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



$scope.$watch($cookieStore.put, function () {
	if($cookieStore.get('pollUser')){
		$rootScope.user = $cookieStore.get('pollUser');

		console.log($rootScope.user)

		$scope.isUserLoggedIn = true;
	} else {
		$scope.isUserLoggedIn = false;
	}
});

$scope.$on('updateUser', function(){
	userService.setUser().then(function(){
		if($cookieStore.get('pollUser')){
		$rootScope.user = $cookieStore.get('pollUser');

		console.log($rootScope.user)

		$scope.isUserLoggedIn = true;
	} else {
		$scope.isUserLoggedIn = false;
	}
	$scope.getPolls();
	})
	console.log('It is updating')
})

$scope.fbLogOut = function(){
	$scope.isUserLoggedIn = false;
	$cookieStore.remove('pollUser');
	$location.path('/logout')
}

});