window.Direxio.factory('directionsSvc', ['$http', function($http) {
    var self = {};
    
    self.getCurrentLocation = function(callbackFn) {
        if(!navigator.geolocation) {
            alert("Sorry, your device does not support geo location features! :/");
            return false;
        }
        
        navigator.geolocation.getCurrentPosition(callbackFn);
    };
    
    self.getConnections = function(from, to, callbackFn) {
        $http({method: 'GET', url: 'http://cors.io/maps.googleapis.com/maps/api/directions/json?'
            + 'origin=' + from
            + '&destination=' + to
            + '&departure_time=' + ~~(new Date().getTime() / 1000)
            + '&sensor=true&mode=transit&alternatives=true'})
        .success(callbackFn);
    };
    
    self.getConnectionsFromHereTo = function(destination, callbackFn) {
        self.getCurrentLocation(function(position) {
            var from = position.coords.latitude + ',' + position.coords.longitude;
            self.getConnections(from, destination, function(data) {
                var connections = [];
                for(var i=0, len = data.routes.length;i < len; i++) {
                    var route = data.routes[i];
                    var connection = {
                        displayText: route.legs[0].departure_time.text + " - " + route.legs[0].arrival_time.text,
                        steps: route.legs[0].steps
                    };
                    connections.push(connection);
                }
                callbackFn(connections);
            });
        });
    };
    
    return self;
}]);