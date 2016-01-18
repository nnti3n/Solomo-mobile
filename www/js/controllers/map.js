angular.module('solomo.controllers')

    .controller('MapCtrl', function ($scope, $cordovaGeolocation, $ionicLoading) {

        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-positive"></ion-spinner>'
        });


        var posOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;

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
        }, function (err) {
            $ionicLoading.hide();
            console.log(err);
        });

    });
