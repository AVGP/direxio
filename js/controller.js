function AppCtrl($scope, $location) {    
  $scope.triggerAside = function() {
    Lungo.Router.aside('main', 'aside1');
  }    
}

function DirectionsCtrl($scope, directionsSvc) {
    $scope.destination = "Zurich HB";
    $scope.connections = [];
    $scope.isLoading = false;
    
    $scope.isInstallable = function() {
//        alert(window.navigator.mozApps !== undefined);
        return window.navigator.mozApps !== undefined;
    }
    
    $scope.install = function() {
        console.log("Installation attempt...");
        var request = window.navigator.mozApps.install(location.href + '/manifest.webapp');
        request.onsuccess = function () {
            // Save the App object that is returned
            var appRecord = this.result;
            alert('Installation successful!');
        };
        request.onerror = function () {
            // Display the error information from the DOMError object
            alert('Install failed, error: ' + this.error.name);
        };    
    }
    
    $scope.findConnections = function() {
        $scope.isLoading = true;
        if(window.webkitNotifications && window.webkitNotifications.checkPermission() !== 0) {
            window.webkitNotifications.requestPermission();
        }
        
        directionsSvc.getConnectionsFromHereTo($scope.destination, function success(connections) {
            $scope.isLoading = false;
            console.log(connections);
            $scope.connections = connections;
        }, function error(error, status) {
            if(error) {
                alert("Oh noes! :( We had an error(" + error + ")");
            }
            console.log(error, status);
            $scope.isLoading = false;
        });
    }
}