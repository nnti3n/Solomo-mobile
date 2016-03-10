angular.module('solomo.controllers')

    .controller('DashCtrl', function($scope, $state, Post, UserService, $ionicLoading) {
        //search
        $ionicLoading.show({
            template: 'loading..',
            duration: 10000
        });

        $scope.user = {};
        $scope.user.picture = UserService.getUser().picture;
        $scope.user.name = UserService.getUser().name;
        $scope.search = {};
        $scope.search.searchText = "";

        $scope.clear_search = function () {
            $scope.search.searchText = "";
        };

        $scope.OpenDetail = function (viewId) {
            $state.go("tab.view-detail", {viewId: viewId})
        };

        Post.feeds({
            params: {
                user_token: UserService.getUser().user_token
            },
            timeout: 10000
        }, function (success) {
            console.log(success);
            $scope.feeds = success.posts;
            $ionicLoading.hide();
        }, function (error) {
            $ionicLoading.hide();
            $window.alert("error loading feeds");
            console.log(error);
        });
    });
