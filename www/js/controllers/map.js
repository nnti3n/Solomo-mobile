angular.module('solomo.controllers')

.controller('MapCtrl', function ($scope, UserService,$ionicLoading, $state, $ionicModal, $stateParams, MapService, $timeout,$ionicHistory) {


    $scope.once = false;
    //get options for map
    var lat = UserService.getLat();
    var long = UserService.getLong();
    // console.log($stateParams.feed.id);

    var myLatlng = new google.maps.LatLng(lat, long);
    var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var userMarker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.FADE,
                position: myLatlng,
                icon:"img/marker_red.png"
    });

    //get feeds from localstorage
    //var feeds_load = UserService.getObject('feed');
    $scope.list = [];
    // $scope.once = 0;

    //load deals
    var changes = [];

    // google.maps.event.addListenerOnce(map, 'idle', function(){
    //     loadfeeds();
    // });

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
    google.maps.event.addListener(infowindow,'closeclick',function(){
        focusfeed = {};
    });

    function attachSecretMessage(marker, feed) {
         // console.log(feed);
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent('<div onclick="OpenDetail('+ feed.id +')" class="item-text-wrap map-item"><img src="'+feed.picture_url+'" ><div>'+feed.description+'</div></div>');
            infowindow.open(marker.get('map'), marker);
            focusfeed = feed;
            map.panTo(marker.getPosition());
        });
    }


    OpenDetail = function(id){
        console.log(id);
        $scope.OpenDetail(id);
    };

    // loadfeeds();
    var focusfeed = {};
    $scope.$on("$ionicView.enter", function () {
        console.log($ionicHistory.backView());
        // if ($ionicHistory.backView() && $ionicHistory.backView().stateName == "tab.view-detail") {
        focusfeed = UserService.getObject('mappost');
        // }
        if (focusfeed == null)
        {
            focusfeed = {};
            lat = UserService.getLat();
            long = UserService.getLong();

            myLatlng = new google.maps.LatLng(lat, long);
            map.panTo(myLatlng);
        }
        // console.log($stateParams)
        console.log(focusfeed);
        // $stateParams.feed = {};
        $scope.once = false;
        // $scope.$timeout(function() {
        setTimeout(function() {
            // infowindow.close();
            loadfeeds();
            $scope.$apply();
        }, 1000);
    });

    function loadfeeds() {
        // console.log(map.getBounds);
        console.log($scope.once);
        var bounds =  map.getBounds();
        if (bounds == null || typeof(bounds) == 'undefined') {
            return;
        }
        $ionicLoading.show();
        // console.log($stateParams)
        if (focusfeed.id && !$scope.once) {
            lat = focusfeed.lat;
            long = focusfeed.long;
            myLatlng = new google.maps.LatLng(lat, long);
            // $stateParams.feed = {};
            console.log($scope.once);
            if (!$scope.once){
                map.panTo(myLatlng);
                $scope.once = true;
            }
            console.log("aaa");
            // $scope.once = true;
        }

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
                position: dealLatlng,
                icon:"img/marker.png"
            });

            post = feeds[feed].result_data;
            post.marker = marker;
            post.OnClick = function(){
                infowindow.setContent('<div onclick="OpenDetail('+ feed.id +')" class="item-text-wrap map-item"><img src="'+feed.picture_url+'" ><div>'+feed.description+'</div></div>');
                infowindow.open(map, this.marker);
                map.panTo(this.marker.getPosition());
            };
            $scope.list.push(post);

            attachSecretMessage(marker,feeds[feed].result_data);
        }

        // console.log($stateParams.id);
        // console.log($stateParams.lat);
        // console.log($scope.once);
        // //open map from post
        if (focusfeed.id) {
            for (item in $scope.list) {
                // console.log(item);
                if ($scope.list[item].id == focusfeed.id) {
                    map.panTo(myLatlng);
                    // $scope.list[item].OnClick();
                    infowindow.setContent('<div onclick="OpenDetail('+ $scope.list[item].id +')" class="item-text-wrap map-item"><img src="'+$scope.list[item].picture_url+'" ><div>'+$scope.list[item].description+'</div></div>');
                    infowindow.open(map, $scope.list[item].marker);
                    // map.panTo(this.marker.getPosition());
                }
            }
        }
        // $stateParams.feed = {};
        $ionicLoading.hide();
    }

    $scope.focusPost = function (postId) {
        for (item in $scope.list) {
            // console.log(item);
            if ($scope.list[item].id == postId) {
                infowindow.setContent('<div onclick="OpenDetail('+ $scope.list[item].id +')" class="item-text-wrap map-item">' +
                    '<img src="'+$scope.list[item].picture_url+'" ><div>'+$scope.list[item].description+'</div></div>');
                infowindow.open(map, $scope.list[item].marker);
                 map.panTo($scope.list[item].marker.getPosition());
            }
        }
    };

    //get distance by meter
    $scope.distanceSort = function getDistance(post) {
        lat1 = post.lat;
        lon1 = post.long;
        lat2 = map.getCenter().lat();
        lon2 = map.getCenter().lng();
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c * 1000; // Distance in m
        return Math.round(d);
    };

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    //open detail post
    $scope.OpenDetail = function (viewId) {
        $scope.toggle(true);
        $state.go("tab.view-detail", {viewId: viewId})
    };

    $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
        $scope.toggle = function (exit) {
            if ($ionicModal.isShown() || exit) {
                $ionicModal.hide();
            } else {
                $ionicModal.show();
            }
        }
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
    });
});
