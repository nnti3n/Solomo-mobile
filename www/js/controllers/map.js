angular.module('solomo.controllers')

.controller('MapCtrl', function ($scope, UserService,$ionicLoading, $state, $ionicModal, $stateParams, MapService) {

    //get options for map
    var lat = 10.7763342;
    var long = 106.7010091;

    if ($stateParams.id) {
        lat = $stateParams.lat;
        long = $stateParams.long;
    } else {
        lat = UserService.getLat();
        long = UserService.getLong();
    }

    var myLatlng = new google.maps.LatLng(lat, long);
    var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //get feeds from localstorage
    //var feeds_load = UserService.getObject('feed');
    $scope.list = [];
    $scope.once = 0;

    //load deals
    var changes = [];

    map.addListener('dragend', function() {
        changes.push(1);
        setTimeout(function() {
            if (changes.length) {
                changes = [];
                loadfeeds();
            }
        }, 1000);
    });

    map.addListener('zoom_changed', function() {
        changes.push(1);
        setTimeout(function() {
            if (changes.length) {
                changes = [];
                loadfeeds();
            }
        }, 1000);
    });

    // $scope.nelat = 0;
    // $scope.nelng = 0;

    // map.addListener('idle', function() {
    //     var bounds =  map.getBounds();
    //     var ne = bounds.getNorthEast();
    //     $scope.nelat = ne.lat();
    //     $scope.nelng = ne.lng();
    // });

    var infowindow = new google.maps.InfoWindow();

    function attachSecretMessage(marker, feed) {
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(feed.description);
            infowindow.open(marker.get('map'), marker);
            map.panTo(marker.getPosition());
        });
    }

    loadfeeds();

    $scope.$on("$ionicView.enter", function () {
        loadfeeds();
        $scope.once = 1;
    });

    function loadfeeds() {
        // console.log(map.getBounds);
        var bounds =  map.getBounds();
        if (bounds == null || typeof(bounds) == 'undefined') {
            return;
        }
        $ionicLoading.show();
        var ne = bounds.getNorthEast();
        var lat0 = ne.lat();
        var lng0 = ne.lng();
        var lat1 = map.getCenter().lat();
        var lng1 = map.getCenter().lng();
        console.log(lat0);
        radius = Math.sqrt((lat0-lat1)*(lat0-lat1)+(lng0-lng1)*(lng0-lng1));
        MapService.locate({
            params: {
                user_token: UserService.getUser().user_token,
                lat: map.getCenter().lat(),
                long: map.getCenter().lng(),
                radius: radius
            }
        }, function(success) {
            console.log(success);
            // setMapOnAll(null);
            pushfeeds(success.results);
        }, function(error) {
            console.log(error);
        });

    }

    function pushfeeds(feeds) {
        // console.log(feeds);
        console.log($scope.list);

        for(post in $scope.list){
            $scope.list[post].marker.setMap(null);
        }
        $scope.list = [];

        for(feed in feeds) {
            // console.log(feeds[feed].result_data);
            if (feeds[feed].result_data.lat == null || feeds[feed].result_data.long == null){
                continue;
            }

            var dealLatlng = new google.maps.LatLng(feeds[feed].result_data.lat, feeds[feed].result_data.long);
            var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.FADE,
                position: dealLatlng
            });

            post = feeds[feed].result_data;
            post.marker = marker;
            post.OnClick = function(){
                infowindow.setContent(this.description);
                infowindow.open(map, this.marker);
                map.panTo(this.marker.getPosition());
            };
            $scope.list.push(post);

            attachSecretMessage(marker,feeds[feed].result_data);
        }

        console.log($stateParams.id);
        console.log($stateParams.lat);
        console.log($scope.once);
        //open map from post
        if ($stateParams.id && $scope.once == 0) {
            for (item in $scope.list) {
                if (item.id == $stateParams.id) {
                    infowindow.open(map, this.marker);
                    map.panTo(this.marker.getPosition());
                }
            }
        }

        $ionicLoading.hide();
    }

    //open detail post
    $scope.OpenDetail = function (viewId) {
        $scope.modal.hide();
        $state.go("tab.view-detail", {viewId: viewId})
    };

    $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
    });
});
