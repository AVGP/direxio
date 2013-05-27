function AppCtrl($scope, $location) {    
  $scope.triggerAside = function() {
    Lungo.Router.aside('main', 'aside1');
  }    
}

function DirectionsCtrl($scope, directionsSvc) {
    $scope.destination = "Zurich HB";
    $scope.connections = [];
    
    $scope.findConnections = function() {
        directionsSvc.getConnectionsFromHereTo($scope.destination, function(connections) {
            console.log(connections)
            $scope.connections = connections;
        });
    }
}