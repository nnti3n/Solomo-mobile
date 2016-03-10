angular.module('solomo.controllers')

    .controller('ViewDetailCtrl', function($scope, $ionicHistory, $state) {
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

        Post.feeds({
            params: {
                user_token: UserService.getUser().user_token
            },
            timeout: 10000
        }, function (success) {
            console.log(success);
            $scope.post = success.post;
            $ionicLoading.hide();
        }, function (error) {
            $ionicLoading.hide();
            $window.alert("error loading feeds");
            console.log(error);
        });

        //back button
        $scope.GoBack = function () {
            if ($ionicHistory.viewHistory()) {
                $ionicHistory.goBack();
            } else {
                $state.go('tab.dash');
            }
        }


    });
