function AppCtrl($scope, $location) {    
  $scope.triggerAside = function() {
    Lungo.Router.aside('main', 'aside1');
  }    
}

function DirectionsCtrl($scope, directionsSvc) {
    $scope.destination = "";
    $scope.connections = [];
    $scope.isLoading = false;
    $scope.loadingState = "Loading...";
    $scope.showFromField = false;
    $scope.installable = false;
    
    if(window.navigator.mozApps) {
        var req = window.navigator.mozApps.getSelf();
        req.onsuccess = function() {
            if(req.result == null) {
                $scope.$apply(function() {
                    $scope.installable = true;
                });
            }
        };
        req.onerror = function() {
            console.log("ERR");
            console.log(req.result);
        }  
    }
    
    $scope.isInstallable = function() { return $scope.installable; };
    
    $scope.install = function() {
        console.log("Installation attempt...");
        //TODO Find a better way around this absolute URL problem
        var request = window.navigator.mozApps.install('http://192.168.1.103:8000/manifest.webapp');//'http://avgp.github.io/direxio/manifest.webapp');
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
    
    $scope.toggleCustomFrom = function() {
        $scope.showFromField = !$scope.showFromField;
    };
    
    $scope.findConnections = function() {
        $scope.isLoading = true;
        if(window.webkitNotifications && window.webkitNotifications.checkPermission() !== 0) {
            window.webkitNotifications.requestPermission();
        }
        if($scope.from === "" || $scope.from === undefined) {
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
            }, function setLoadingState(state) { $scope.loadingState = state; console.log("LS: ", $scope.loadingState); });
        } else { //Search from given location
            console.log("YO!", $scope.from);
            directionsSvc.getConnections($scope.from, $scope.destination, function success(connections) {
                $scope.isLoading = false;
                console.log(connections);
                if(connections.length === 0) {
                  alert("No connections found :C");
                }
                $scope.connections = connections;
            }, function error(err, status) {
                if(err) {
                    alert("Oh noes! :( We had an error(" + err + ")");
                }
                console.log("ERR:", err);
                console.log("Status:", status);
                $scope.isLoading = false;
            });
        }
    }
}