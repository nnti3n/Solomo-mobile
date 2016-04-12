angular.module('solomo.controllers')

.controller('DashCtrl', function($scope, $state, Post, UserService, $ionicLoading, $rootScope, Feeds) {
        //search
        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>',
            duration: 15000
        });

        $scope.request = {};
        $scope.user = {};
        $scope.crawl = {};
        $scope.toggle = {};
        $scope.user.picture = UserService.getUser().picture;
        $scope.user.name = UserService.getUser().name;
        $scope.search = {};
        $scope.search.searchText = "";
        $scope.crawl.desc = "";
        $scope.toggle.all = "active";
        $scope.request.page = 1;

        $scope.crawl.getall = function () {
            $scope.toggle = {};
            $scope.toggle.all = "active";
            $scope.crawl.desc = "";
        };

        $scope.crawl.getuser = function () {
            $scope.toggle = {};
            $scope.toggle.user = "active";
            $scope.crawl.desc = "user";
        };

        $scope.crawl.getcrawler = function () {
            $scope.toggle = {};
            $scope.toggle.crawler = "active";
            $scope.crawl.desc = "crawl";
        };

        $scope.clear_search = function () {
            $scope.search.searchText = "";
        };

        $scope.OpenDetail = function (viewId) {  
            CreateWaypoint();
            setTimeout(ReadFeed,2000);
            $state.go("tab.view-detail", {viewId: viewId});
        };

        $scope.GotoProfile = function (userId) {
            CreateWaypoint();
            setTimeout(ReadFeed,2000);
            $state.go("tab.user-profile", {userId: userId});
        };
        //call api
        PostRequest();

        var ReadFeed = function(){
            console.log($scope.PostsSeen);
            console.log($scope.PostsSeen.toString());
            Feeds.read({
                    user_token: UserService.getUser().user_token,
                    feed_ids: $scope.PostsSeen.toString()
            }, function (success) {
                // $scope.PostsSeen = [];
                console.log(success);
            }, function (error) {
                // $scope.PostsSeen = [];
                console.log(error);
            });
        };

        //pull to refresh
        $scope.doRefresh = function() {
            CreateWaypoint();
            setTimeout(ReadFeed,2000);
            $scope.request.page = 1;
            PostRequest();
        };

        $scope.loadMore = function() {
            if ($scope.request.limit && $scope.request.page > $scope.request.limit) {
                console.log("end of page");
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return null;
            }

            Post.feeds({
                params:{
                    user_token:UserService.getUser().user_token,
                    page:$scope.request.page+1
                },
                timeout: 15000
            }, function(success){
                console.log("aaaaaaaaaaa");
                // setTimeout(CreateWaypoint, 3000);
                $scope.feeds = $scope.feeds.concat(success.posts);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.request.limit = success.pagination.total_pages;
                $scope.request.page++;
                $ionicLoading.hide();
            },function(error){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $ionicLoading.hide();
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
                // setTimeout(CreateWaypoint, 1000);
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

        $scope.PostsSeen = [];

        var CreateWaypoint = function() {
            for (item in $scope.feeds){
                var waypoint = new Waypoint({
                  element: document.getElementById($scope.feeds[item].id),
                  triggerOnce: true,
                  handler: function(direction) {
                    console.log('Scrolled to ' + this.element.id);
                    $scope.PostsSeen.push(this.element.id);
                    this.destroy();
                    $scope.$apply();
                }});
            }
        };

        function Share(){
        };

    });
