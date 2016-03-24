angular.module('solomo.controllers')

    .controller('DashCtrl', function($scope, $state, Post, UserService, $ionicLoading) {
        //search
        $ionicLoading.show({
            template: 'loading...',
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

        //call api
        PostRequest();

        //pull to refresh
        $scope.doRefresh = function() {
            PostRequest();
        };

        function PostRequest() {
            Post.feeds({
                params: {
                    user_token: UserService.getUser().user_token
                },
                timeout: 10000
            }, function (success) {
                console.log(success);
                $scope.feeds = success.posts;
                UserService.setObject('feed', success.posts);
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
            }, function (error) {
                $ionicLoading.hide();
                $scope.feeds = UserService.getObject('feed');
                console.log(error);
            });
        }


    });
