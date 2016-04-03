angular.module('solomo.controllers')

    .controller('DashCtrl', function($scope, $state, Post, UserService, $ionicLoading) {
        //search
        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>',
            duration: 15000
        });

        $scope.request = {};
        $scope.user = {};
        $scope.crawl = {};
        $scope.user.picture = UserService.getUser().picture;
        $scope.user.name = UserService.getUser().name;
        $scope.search = {};
        $scope.search.searchText = "";
        $scope.crawl.desc = "";
        $scope.request.page = 1;

        $scope.crawl.getall = function () {
            $scope.crawl.desc = "";
        };

        $scope.crawl.getuser = function () {
            $scope.crawl.desc = "user";
        };

        $scope.crawl.getcrawler = function () {
            $scope.crawl.desc = "crawl";
        };

        $scope.clear_search = function () {
            $scope.search.searchText = "";
        };

        $scope.OpenDetail = function (viewId) {
            $state.go("tab.view-detail", {viewId: viewId})
        };

        $scope.GotoProfile = function (userId) {
            $state.go("tab.user-profile", {userId: userId})
        };

        //call api
        PostRequest();

        //pull to refresh
        $scope.doRefresh = function() {
            PostRequest();
        };

        $scope.loadMore = function() {
            Post.feeds({
                params:{
                    user_token:UserService.getUser().user_token,
                    page:$scope.request.page+1
                },
                timeout: 15000
            }, function(success){
                $scope.feeds = $scope.feeds.concat(success.posts)
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $ionicLoading.hide();
                $scope.request.page++;
            },function(error){
                $ionicLoading.hide();
                // $scope.feeds = UserService.getObject('feed');
                console.log(error);
            });
        };

        function PostRequest() {
            Post.feeds({
                params: {
                    user_token: UserService.getUser().user_token,
                    page: $scope.request.page
                },
                timeout: 15000
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
