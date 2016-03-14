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

    google.maps.event.addListenerOnce(map, 'idle', function () {

        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: myLatlng
        });

    });

    $ionicLoading.hide();
});
