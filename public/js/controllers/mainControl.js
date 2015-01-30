var app = angular.module('polls')

app.controller('mainControl', function($rootScope, $scope, $location, pollService, socket, userService){

$scope.createPollBtn = true;

$scope.showPollSetup = function(){
	$scope.createPollBtn = false;
}

  // Socket Handlers
	socket.emit('joinRoom', 'mainRoom');

  socket.on('pollCreated', function(){
		$scope.getPolls();
	});

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


	$scope.getPolls = function(polls){
		$scope.trendingPolls = [];
		$scope.limit = 0;
		pollService.getPolls().then(function(polls){
			$scope.polls = polls;
				for(var i =0; i < $scope.polls.length; i++){
					if($scope.user.votedPolls.indexOf($scope.polls[i]._id) > -1){
						$scope.polls[i].pollTaken = true;
					} else {
						$scope.polls[i].pollTaken = false;
					}
				}
				for(var i = 0; i < $scope.polls.length; i++){
				//a trending poll that has been taken will display 'view stats'
				
				if($scope.polls[i].allVotes >= 5 && $scope.user){
						$scope.trendingPolls.push(polls[i]);
						$scope.polls.splice(i, 1);
						i--;
						$scope.limit++;
					}
				// //a regular poll that has been taken but not trending will display 'view stats'
				//  else if($scope.polls[i].allVotes < 2 && $scope.user && $scope.user.votedPolls.indexOf($scope.polls[i]._id) < -1){
				 	
									
				// 	} 
				// 	else if($scope.polls[i].allVotes < 2 && $scope.user && $scope.user.votedPolls.indexOf($scope.polls[i]._id) > -1){
				 	
								
				// 	} 
				// //a regular poll that has NOT been taken will display 'take poll'
				// else{
					
					
				// }

			}
		});
	}

		// $scope.trendingPolls[$scope.trendingPolls.length - 1].pollTaken = true;
		// $scope.trendingPolls[$scope.trendingPolls.length - 1].pollTaken = false;
		// $scope.polls[i].pollTaken = false;
		
		// $scope.polls[i].pollTaken = false;		
	

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


	$scope.testCreatePoll = function() {
		pollService.addPoll($scope.poll)
		$scope.poll = {
			question: '',
			pollOptions: [{text: ''}, {text: ''}],
			category: []
		};
		socket.emit('pollCreated')
	}

	$scope.takePoll = function(poll){
		$location.path('/polls/' + poll._id);	
	}

	$scope.viewStats = function(poll){
		$location.path('/polls/' + poll._id + '/stats')
	}

$scope.$on('updateUser', function(){
	$scope.updateUser();
	
	console.log('It is updating')
})

$scope.fbLogOut = function(){
	$scope.isUserLoggedIn = false;
	$location.path('/logout')
}

});