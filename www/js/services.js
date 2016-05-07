angular.module('solomo.services')

.service('UserService', function ($localStorage) {
    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
    var setUser = function (user_data) {
        window.localStorage.starter_facebook_user = JSON.stringify(user_data);
    };

    var getUser = function () {
        return JSON.parse(window.localStorage.starter_facebook_user || '{}');
    };

    var setImage = function (id) {
        window.localStorage.image_post = id;
    };

    var getImage = function () {
        return window.localStorage.image_post;
    };

    var setLat = function (lat) {
        window.localStorage.lat = lat;
    };

    var getLat = function () {
        return window.localStorage.lat;
    };

    var setLong = function (long) {
        window.localStorage.long = long;
    };

    var getLong = function () {
        return window.localStorage.long;
    };

    var setObject =function(key, value) {
        window.localStorage[key] = JSON.stringify(value);
        //console.log(window.localStorage[key]);
    };

    var getObject = function(key) {
        //console.log(window.localStorage[key]);
        return JSON.parse(window.localStorage[key] || '{}');
    };

    return {
        getUser: getUser,
        setUser: setUser,
        setImage: setImage,
        getImage: getImage,
        setLat:setLat,
        getLat:getLat,
        setLong:setLong,
        getLong:getLong,
        setObject:setObject,
        getObject:getObject
    };
});


angular.module('angularRestful', [])

.factory('Auth', ['$http', '$localStorage', function ($http, $localStorage) {

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
            break;
            case 2:
            output += '==';
            break;
            case 3:
            output += '=';
            break;
            default:
            throw 'Illegal base64url string!';
        }
        return window.atob(output);
    }

    function getUserFromToken() {
        var token = $localStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
    }

    var currentUser = getUserFromToken();

    return {
        save: function (data, success, error) {
            $http.post(baseUrl + '/signin', data).success(success).error(error)
        },
        FbLogin: function (data, success, error) {
            $http.post(baseUrl + '/omniauth/facebook.json', data).success(success).error(error)
        },
        me: function (success, error) {
            $http.get(baseUrl + '/account.json').success(success).error(error)
        },
        logout: function (success) {
            changeUser({});
            delete $localStorage.starter_facebook_user;
            success();
        }
    };
}
])

.factory('Post', ['$http', '$localStorage', function ($http) {
    return {
        send: function (data, success, error) {
            $http.post(baseUrl + '/posts.json', data).success(success).error(error)
        },
        share: function (data, success, error) {
            $http.post(baseUrl + '/posts/share.json', data).success(success).error(error)
        },
        get: function (data, success, error) {
            console.log(data);
            $http.get(baseUrl + '/posts/' + data.params.post_id+ '.json', data).success(success).error(error)
        },
        feeds: function (data, success, error) {
            $http.get(baseUrl + '/feeds.json', data).success(success).error(error)
        },
        posts: function (data, success, error) {
            $http.get(baseUrl + '/posts.json', data).success(success).error(error)
        },
        likedposts: function (data, success, error) {
            $http.get(baseUrl + '/posts.json', data).success(success).error(error)
        },
        detail: function (data, success, error) {
            $http.get(baseUrl + '/posts.json', data).success(success).error(error)
        },
        like: function (data, success, error) {
            $http.post(baseUrl + '/post_likes/like.json', data).success(success).error(error)
        },
        unlike: function (data, success, error) {
            $http.post(baseUrl + '/post_likes/unlike.json', data).success(success).error(error)
        },
        loadtag: function (data, success, error) {
            $http.get(baseUrl + '/search/tags.json', data).success(success).error(error)
        },
        loadprofile: function (data, success, error) {
            $http.get(baseUrl + '/users/'+data.params.user_id+'.json', data).success(success).error(error)
        }
    };
}])

.factory('Comment', ['$http', function ($http) {
    return {
        send: function (data, success, error) {
            $http.post(baseUrl + '/comments.json', data).success(success).error(error)
        }
    };
}])

.factory('Follow', ['$http', function ($http) {
    return {
        follow: function (data, success, error) {
            $http.post(baseUrl + '/followers.json', data).success(success).error(error)
        },
        follower: function(data, success, error){
            $http.get(baseUrl + '/followers.json', data).success(success).error(error)
        },
        following: function(data,success, error){
            $http.get(baseUrl + '/followings.json', data).success(success).error(error)
        },
        unfollow: function (data, success, error) {
            $http.delete(baseUrl + '/followers.json', data).success(success).error(error)
        }
    };
}])

.service('MapService', function ($http) {
    return {
        locate: function(data, success, error) {
            $http.get(baseUrl + '/search/posts_by_location.json', data).success(success).error(error)
        }
    }
})

.service('NotiService', function (UserService, $http) {
    return {
        noti: function () {

        },
        get: function(data, success, error) {
            $http.get(baseUrl + '/notifications', data).success(success).error(error)
        },
        read: function(data, success, error) {
            $http.post(baseUrl + '/notifications/read', data).success(success).error(error)
        }
    };
})

.service('Feeds', function (UserService, $http) {
    return {
        read: function (data, success, error) {
            $http.post(baseUrl + '/feeds/read.json', data).success(success).error(error)
        },
        search_all: function (data, success, error) {
            $http.get(baseUrl + '/search/all.json', data).success(success).error(error)
        }
    };
})

.factory('CameraService', ['$q', function($q) {

    return {
        getPicture: function(options) {
            var q = $q.defer();

            navigator.camera.getPicture(function(result) {
                // Do any magic you need
                q.resolve(result);
            }, function(err) {
                q.reject(err);
            }, options);

            return q.promise;
        }
    }
}]);
