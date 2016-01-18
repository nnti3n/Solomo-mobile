angular.module('solomo.controllers')

    .controller('AccountCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading,$cordovaCamera){
        $scope.showLogOutMenu = function() {
            var hideSheet = $ionicActionSheet.show({
                destructiveText: 'Logout',
                titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
                cancelText: 'Cancel',
                cancel: function() {},
                buttonClicked: function(index) {
                    return true;
                },
                destructiveButtonClicked: function(){
                    $ionicLoading.show({
                        template: 'Logging out...'
                    });

                    // Facebook logout
                    facebookConnectPlugin.logout(function(){
                            $ionicLoading.hide();
                            $state.go('login');
                        },
                        function(fail){
                            $ionicLoading.hide();
                        });
                }
            });
        };
    });
