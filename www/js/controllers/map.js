angular.module('solomo.controllers')

.controller('MapCtrl', function ($scope, UserService,$ionicLoading) {

    $ionicLoading.show({
        template: '<ion-spinner icon="ripple" class="spinner-positive"></ion-spinner>',
        duration: 10000
    });

    var lat = UserService.getLat();
    var long = UserService.getLong();

    var myLatlng = new google.maps.LatLng(lat, long);
    var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var feeds = UserService.getObject('feed');
    // console.log(feeds[5]);
    $scope.list = [];
    // $scope.maker = [];
    for(feed in feeds){
        console.log(feeds[feed]);
        if (feeds[feed].lat == null || feeds[feed].long == null){
            continue;
        }
        $scope.list.push(feeds[feed]);
        var dealLatlng = new google.maps.LatLng(feeds[feed].lat, feeds[feed].long);
        console.log("yeah");
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: dealLatlng
        });

        attachSecretMessage(marker,feeds[feed])
    }


    function attachSecretMessage(marker, feed) {
        var infowindow = new google.maps.InfoWindow({

            content: feed.description
        });


        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(marker.get('map'), marker);
        });
    }

    $ionicLoading.hide();
});
