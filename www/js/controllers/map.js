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
    for(feed in feeds){
        console.log(feeds[feed]);
        if (feeds[feed].lat == null || feeds[feed].long == null){
            continue;
        }
        var dealLatlng = new google.maps.LatLng(feeds[feed].lat, feeds[feed].long);
        console.log("yeah");
        google.maps.event.addListenerOnce(map, 'idle', function () {
            var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                position: dealLatlng
            });
        });
    }

    $ionicLoading.hide();
});
