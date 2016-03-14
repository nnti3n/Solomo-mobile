angular.module('solomo.controllers')

    .controller('PostCtrl', function ($scope, UserService, $ionicActionSheet, $state, $ionicLoading, $cordovaCamera, $cordovaFileTransfer, $cordovaGeolocation,Post) {

        $scope.img = {};
        $scope.desc= {};

        $scope.choosePicture = function () {
            $scope.imageHandle(Camera.PictureSourceType.PHOTOLIBRARY);
        };

        $scope.takePicture = function () {
            $scope.imageHandle(Camera.PictureSourceType.CAMERA);
        };

        $scope.imageHandle = function (Type) {

            var currentDate = new Date();

            var cameraOptions = {
                sourceType: Type,
                targetWidth: 500,
                targetHeight: 500
            };

            var uploadOptions = {
                fileKey: "image",
                fileName: currentDate + ".jpeg",
                chunkedMode: false,
                mimeType: "image/jpeg",
                params: {user_token: UserService.getUser().user_token}
            };

            $cordovaCamera.getPicture().then(function (imageData) {
                var cameraImage = document.getElementById('image');
                cameraImage.style.display = 'block';
                cameraImage.src = imageData;

                $scope.img = imageData;
                console.log($scope.img);

                $ionicLoading.show({
                    template: 'uploading image..'
                });

                //upload image
                $cordovaFileTransfer.upload(baseUrl+'/picture.json', imageData, uploadOptions)
                    .then(function(result){
                        $ionicLoading.hide();
                        var response = JSON.parse(result.response);
                        $scope.img.info = response.id;
                        //set localstorage for id
                        UserService.setImage(response.id);
                    }, function(error){
                        console.log(error);
                    }, function(progress){});


            }, function (err) {
                console.log(err);
            });
        };

        $scope.post = function () {
            $ionicLoading.show({
                template: 'posting..'
            });

            Post.send({
                description: $scope.desc.content,
                user_token: UserService.getUser().user_token,
                picture_id: UserService.getImage(),
                location_lat:UserService.getLat(),
                location_long:UserService.getLong()
            }, function (success) {
                $ionicLoading.hide();
                $state.go('tab.account', {}, { reload: true });
                console.log(success);
            }, function (error) {
                $ionicLoading.hide();
                console.log(error);
            });
        }
    });
