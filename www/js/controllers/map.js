angular.module('solomo.controllers')

.controller('MapCtrl', function ($scope, UserService,$ionicLoading) {

    $ionicLoading.show({
        template: '<ion-spinner icon="lines"></ion-spinner>',
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
        //console.log(feeds[feed]);
        if (feeds[feed].lat == null || feeds[feed].long == null){
            continue;
        }

        // $scope.$apply();
        var dealLatlng = new google.maps.LatLng(feeds[feed].lat, feeds[feed].long);
        console.log("yeah");
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: dealLatlng
        });

        post = feeds[feed];
        post.marker = marker;
        post.OnClick = function(){
            // console.log(id);
            // console.log($scope.list[id]);
            infowindow.setContent(this.description);
            infowindow.open(map, this.marker);
            map.panTo(this.marker.getPosition()) 
        };
        $scope.list.push(post);

        attachSecretMessage(marker,feeds[feed])
    }

    var infowindow = new google.maps.InfoWindow();
    console.log($scope.list);
    function attachSecretMessage(marker, feed) {
        // var infowindow = new google.maps.InfoWindow({

        //     content: feed.description
        // });


        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(feed.description);
            infowindow.open(marker.get('map'), marker);
            map.panTo(marker.getPosition());
        });
    }
    // $scope.OnClick = function(id){
    //     console.log(id);
    //     console.log($scope.list[id]);
    //     infowindow.setContent($scope.list[id].description);
    //     infowindow.open($scope.list[id].marker.get('map'), $scope.list[id].marker);
    //     map.panTo($scope.list[id].marker.getPosition())
    // };
    $ionicLoading.hide();
});
