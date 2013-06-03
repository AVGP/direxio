window.Direxio.factory('directionsSvc', ['$http', function($http) {
    var self = {};
    
    self.getCurrentLocation = function(callbackFn) {
        if(!navigator.geolocation) {
            alert("Sorry, your device does not support geo location features! :/");
            return false;
        }
        console.log("getCurrentLocation was called");
        navigator.geolocation.getCurrentPosition(callbackFn);
    };
    
    self.getConnections = function(from, to, successCallbackFn, errorCallbackFn) {
        $http({method: 'GET', url: 'http://cors.io/maps.googleapis.com/maps/api/directions/json?'
            + 'origin=' + from
            + '&destination=' + to
            + '&departure_time=' + ~~(new Date().getTime() / 1000)
            + '&sensor=true&mode=transit&alternatives=true'})
        .success(successCallbackFn)
        .error(errorCallbackFn);
    };
    
    self.getConnectionsFromHereTo = function(destination, successCallbackFn, errorCallbackFn) {
        self.getCurrentLocation(function(position) {
            var from = position.coords.latitude + ',' + position.coords.longitude;
            console.log("Got position info");
            console.log(from);
            self.getConnections(from, destination, function(data) {
                var connections = [];
                for(var i=0, len = data.routes.length;i < len; i++) {
                    var route = data.routes[i];
                    var connection = route.legs[0];
                    connection.displayText = "";
                    if(route.legs[0].departure_time) {
                        connection.displayText = moment(route.legs[0].departure_time.value * 1000).fromNow()
                            + " - " 
                            + route.legs[0].arrival_time.text;
                        connection.departureTime = route.legs[0].departure_time.value;
                    } else {
                        connection.displayText = route.summary;
                        connection.departureTime = new Date();
                    }
                    connection.bounds = route.bounds;
                    connections.push(connection);
                }
                console.log("FOUND " + connections.length + " connections");
                successCallbackFn(connections);
            }, errorCallbackFn);
        });
    };
    
    return self;
}]);


window.Direxio.factory('notificationSvc', function() {
    var self = {};
    
    self.notify = function(iconUrl, title, message, timeoutMilliSecs) {
        var notification = null;
        if(window.webkitNotifications && (window.webkitNotifications.checkPermission() == 0)) {
            notification = window.webkitNotifications.createNotification(iconUrl, title, message);
        } else if(navigator.mozNotification) {
           notification = navigator.mozNotification.createNotification(title, message, iconUrl);
        }
        
        if(notification !== null) {
           setTimeout(function() {
               notification.show();
           }, timeoutMilliSecs);
           alert("You will get notified, when you have to leave for this connection!");                
        }
    }
    
    return self;
});