angular.module('solomo.controllers')

    .controller('LoginCtrl', function ($scope, $state, $q, UserService, $ionicLoading, Auth, NotiService) {
        // This is the success callback from the login method
        console.log('in');
        if(UserService.getUser()!= null){
            $state.go('tab.dash');
        }
        var fbLoginSuccess = function (response) {
            if (!response.authResponse) {
                fbLoginError("Cannot find the authResponse");
                return;
            }

            var authResponse = response.authResponse;

            getFacebookProfileInfo(authResponse)
                .then(function (profileInfo) {
                    // For the purpose of this example I will store user data on local storage
                    Auth.FbLogin({"facebook_token": authResponse.accessToken}, function(token_success) {
                        console.log(authResponse.accessToken);
                        UserService.setUser({
                            user_token: token_success.user_token,
                            userID: token_success.user_id,
                            name: profileInfo.name,
                            email: profileInfo.email,
                            picture: "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
                        });
                        //notification bind
                        NotiService.noti();
                        $ionicLoading.hide();
                        $state.go('tab.account');
                    }, function(tokenfail) {
                        console.log('get user token fail', tokenfail);
                        $ionicLoading.hide();
                        //alert('get user token fail');

                    })

                }, function (fail) {
                    // Fail get profile info
                    console.log('facebook profile info fail', fail);
                });
        };

        // This is the fail callback from the login method
        var fbLoginError = function (error) {
            console.log('fbLoginError', error);
            $ionicLoading.hide();
        };

        // This method is to get the user profile info from the facebook api
        var getFacebookProfileInfo = function (authResponse) {
            var info = $q.defer();

            facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
                function (response) {
                    console.log(response);
                    info.resolve(response);
                },
                function (response) {
                    console.log(response);
                    info.reject(response);
                }
            );
            return info.promise;
        };

        //This method is executed when the user press the "Login with facebook" button
        $scope.facebookSignIn = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="lines"></ion-spinner>',
                duration: 10000
            });
            facebookConnectPlugin.getLoginStatus(function (success) {
                if (success.status === 'connected') {
                    // The user is logged in and has authenticated your app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed request, and the time the access token
                    // and signed request each expire
                    console.log('getLoginStatus', success.status);

                    // Check if we have our user saved
                    var user = UserService.getUser();

                    if (!user.userID) {
                        getFacebookProfileInfo(success.authResponse)
                            .then(function (profileInfo) {
                                // For the purpose of this example I will store user data on local storage
                                console.log(success.authResponse);
                                Auth.FbLogin({"facebook_token": success.authResponse.accessToken}, function(token_success) {
                                    UserService.setUser({
                                        user_token: token_success.user_token,
                                        userID: token_success.user_id,
                                        name: profileInfo.name,
                                        email: profileInfo.email,
                                        picture: "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                                    });
                                    //notification bind
                                    NotiService.noti();
                                    $state.go('tab.account');
                                }, function(tokenfail) {
                                    console.log('fb connected but get user token fail', tokenfail);
                                    $ionicLoading.hide();
                                    //alert('fb connected but get user token fail');
                                })
                            }, function (fail) {
                                // Fail get profile info
                                console.log('facebook profile info fail', fail);
                            });
                    } else {
                        $state.go('tab.dash');
                    }
                } else {
                    // If (success.status === 'not_authorized') the user is logged in to Facebook,
                    // but has not authenticated your app
                    // Else the person is not logged into Facebook,
                    // so we're not sure if they are logged into this app or not.

                    console.log('getLoginStatus', success.status);

                    // $ionicLoading.show({
                    //     template: '<ion-spinner icon="lines"></ion-spinner>',
                    //     duration: 10000
                    // });

                    // Ask the permissions you need. You can learn more about
                    // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                    facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
                }
            });
        };
    });
