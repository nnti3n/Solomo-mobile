angular.module('solomo.controllers')

    .controller('PostCtrl', function ($scope, UserService, $ionicActionSheet, $state, $ionicLoading, $cordovaCamera, $cordovaFileTransfer, $cordovaGeolocation,Post, $ionicHistory) {

        $scope.img = {};
        $scope.desc= {};

        //back button
        $scope.GoBack = function () {
            if ($ionicHistory.backView()) {
                console.log("back");
                $ionicHistory.goBack();
            } else {
                $state.go('tab.dash');
            }
            //$state.go('tab.dash');
        };

        //take picture immediatly
        $scope.$on("$ionicView.enter", function() {
            $scope.imageHandle(Camera.PictureSourceType.CAMERA);
        });

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
                targetWidth: 1200,
                targetHeight: 800
            };

            var uploadOptions = {
                fileKey: "image",
                fileName: currentDate + ".jpeg",
                chunkedMode: false,
                mimeType: "image/jpeg",
                params: {user_token: UserService.getUser().user_token}
            };

            $cordovaCamera.getPicture(cameraOptions).then(function (imageData) {
                var cameraImage = document.getElementById('image');
                cameraImage.style.display = 'block';
                cameraImage.src = imageData;

                $scope.img = imageData;
                console.log($scope.img);

                $ionicLoading.show({
                    template: 'uploading image...'
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
                template: 'posting...'
            });

            Post.send({
                description: $scope.desc.content,
                user_token: UserService.getUser().user_token,
                picture_id: UserService.getImage(),
                location_lat:UserService.getLat(),
                location_long:UserService.getLong()
            }, function (success) {
                $ionicLoading.hide();
                $scope.img = "";
                $scope.desc.content = "";
                $state.go('tab.account', {}, { reload: true });
                console.log(success);
            }, function (error) {
                $ionicLoading.hide();
                console.log(error);
            });
        }
    });
