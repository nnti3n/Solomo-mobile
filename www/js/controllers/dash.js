angular.module('solomo.controllers')

    .controller('DashCtrl', function($scope){
        $scope.search = {};
        $scope.search.searchText = "";
        $scope.clear_search = function () {
            $scope.search.searchText = "";
        }
    });
