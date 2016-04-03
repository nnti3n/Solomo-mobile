angular.module('solomo.controllers')

.controller('MapCtrl', function ($scope, UserService,$ionicLoading, $state, $ionicModal, MapService) {

    //get options for map
    var lat = UserService.getLat();
    var long = UserService.getLong();

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

    loadfeeds();

    //load deals
    var changes = [];
    map.addListener('center_changed', function() {
        //delay 2 sec after center change
        changes.push(1);
        window.setTimeout(function() {
            if (changes.length) {
                console.log('changed');
                loadfeeds();
                changes = [];
            }
        }, 1000);
    });

    var infowindow = new google.maps.InfoWindow();

    function attachSecretMessage(marker, feed) {
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(feed.description);
            infowindow.open(marker.get('map'), marker);
            map.panTo(marker.getPosition());
        });
    }

    function loadfeeds() {
        MapService.locate({
            params: {
                user_token: UserService.getUser().user_token,
                lat: map.getCenter().lat(),
                long: map.getCenter().lng(),
                zoom: map.getZoom()
            }
        }, function(success) {
            pushfeeds(success.results);
            console.log(success);
        }, function(error) {
            console.log(error);
        });
    }

    function pushfeeds(feeds) {
        console.log(feeds);
        $scope.list = [];
        for(feed in feeds) {
            console.log(feeds[feed].result_data);
            if (feeds[feed].result_data.lat == null || feeds[feed].result_data.long == null){
                continue;
            }

            // $scope.$apply();
            var dealLatlng = new google.maps.LatLng(feeds[feed].result_data.lat, feeds[feed].result_data.long);
            var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
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
