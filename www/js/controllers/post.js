angular.module('solomo.controllers')

    .controller('PostCtrl', function ($scope, UserService, $ionicActionSheet, $state, $ionicLoading, $cordovaCamera, $cordovaFileTransfer) {

        $scope.photos = [];
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
                    template: 'uploading image..',
                    duration: 10000
                });

                //upload image
                $cordovaFileTransfer.upload(baseUrl+'/picture.json', imageData, uploadOptions)
                    .then(function(result){
                        $ionicLoading.hide();
                        console.log(result);
                        $scope.img = result;
                    }, function(error){
                        console.log(error);
                    }, function(progress){});


            }, function (err) {
                console.log(err);
            });
        };

        $scope.post = function () {
            console.log($scope.photos);
            Post.send({
                description: $scope.desc.content,
                user_token: UserService.getUser().user_token,
                picture: $scope.photos,
                tags: "10"
            }, function (success) {
                console.log(success);
            }, function (error) {
                console.log(error);
            });
        }
    });
