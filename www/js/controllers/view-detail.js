angular.module('solomo.controllers')

    .controller('ViewDetailCtrl', function($scope, $ionicHistory, $state,$ionicLoading, $stateParams, Post, UserService, $window) {
        console.log($stateParams.viewId);

        //search
        $scope.search = {};
        $scope.search.searchText = "";
        $scope.clear_search = function () {
            $scope.search.searchText = "";
        };

        $ionicLoading.show({
            template: 'loading..',
            duration: 10000
        });

        // call api
        PostRequest();

        //pull to refresh
        $scope.doRefresh = function() {
            PostRequest();
        };

        function PostRequest() {
            Post.get({
                params: {
                    user_token: UserService.getUser().user_token,
                    post_id: $stateParams.viewId
                },
                timeout: 10000
            }, function (success) {
                console.log(success);
                $scope.post = success;
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
            }, function (error) {
                $ionicLoading.hide();
                $window.alert("error loading feeds");
                console.log(error);
            })
        }

        //back button
        $scope.GoBack = function () {
            if ($ionicHistory.viewHistory()) {
                $ionicHistory.goBack();
            } else {
                $state.go('tab.dash');
            }
        }


    });
