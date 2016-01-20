angular.module('solomo.controllers')

    .controller('DashCtrl', function($scope, $state) {
        //search
        $scope.search = {};
        $scope.search.searchText = "";
        $scope.clear_search = function () {
            $scope.search.searchText = "";
        };

        $scope.OpenDetail = function (viewId) {
            $state.go("tab.view-detail", {viewId: viewId})
        }
    });
