angular.module('solomo.controllers')

    .controller('ViewDetailCtrl', function($scope, $ionicHistory, $state) {
        //search
        $scope.search = {};
        $scope.search.searchText = "";
        $scope.clear_search = function () {
            $scope.search.searchText = "";
        };

        //back button
        $scope.GoBack = function () {
            if ($ionicHistory.viewHistory()) {
                $ionicHistory.goBack();
            } else {
                $state.go('tab.dash');
            }

        }
    });
