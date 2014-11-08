var app = angular.module('polls')

app.controller('mainControl', function($rootScope, $scope, pollService, $location, userService){




	$scope.updateUser = function(){
		userService.getUser().then(function(data){
			$scope.user = data.data;
			if($scope.user){
				$scope.isUserLoggedIn = true;
			} else {
				$scope.isUserLoggedIn = false;
			}
			$scope.getPolls();
		})
	}

	$scope.updateUser();

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
				if($scope.user && $scope.user.votedPolls.indexOf($scope.polls[i]._id) > -1){
					$scope.polls[i].pollTaken = true;
				} else {
					$scope.polls[i].pollTaken = false;
				}
			}
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

// $scope.$watch($cookieStore.put, function () {
// 	if($cookieStore.get('pollUser')){
// 		$rootScope.user = $cookieStore.get('pollUser');

// 		console.log($rootScope.user)

// 		$scope.isUserLoggedIn = true;
// 	} else {
// 		$scope.isUserLoggedIn = false;
// 	}
// });

$scope.$on('updateUser', function(){
	$scope.updateUser();
	// 	if($cookieStore.get('pollUser')){
	// 	$rootScope.user = $cookieStore.get('pollUser');

	// 	console.log($rootScope.user)

	// 	$scope.isUserLoggedIn = true;
	// } else {
	// 	$scope.isUserLoggedIn = false;
	// }
	
	console.log('It is updating')
})

$scope.fbLogOut = function(){
	$scope.isUserLoggedIn = false;
	// $cookieStore.remove('pollUser');
	$location.path('/logout')
}

});