function AppCtrl($scope, $location) {    
  $scope.triggerAside = function() {
    Lungo.Router.aside('main', 'aside1');
  }    
}

function DirectionsCtrl($scope, directionsSvc) {
    $scope.destination = "Zurich HB";
    $scope.connections = [];
    $scope.isLoading = false;
    
    $scope.findConnections = function() {
        $scope.isLoading = true;
        if(window.webkitNotifications && window.webkitNotifications.checkPermission() !== 0) {
            window.webkitNotifications.requestPermission();
        }
        
        directionsSvc.getConnectionsFromHereTo($scope.destination, function(connections) {
            $scope.isLoading = false;
            console.log(connections)
            $scope.connections = connections;
        });
    }
}