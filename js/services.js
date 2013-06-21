window.Direxio.factory('directionsSvc', ['$http', function($http) {
    var self = {};
    
    var setStatusIfNeeded = function(newStatus, statusChangedCallbackFn) {
        if(statusChangedCallbackFn) {
            statusChangedCallbackFn(newStatus);
        }    
    };
    
    var reformatApiResponse = function(data, successCallbackFn) {
        var connections = [];
        for(var i=0, len = data.routes.length;i < len; i++) {
            var route = data.routes[i];
            var connection = route.legs[0];
            connection.displayText = "";
            connection.copyrights = route.copyrights;
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
        setStatusIfNeeded("Found " + connections.length + " connections!");
        console.log("FOUND " + connections.length + " connections");
        successCallbackFn(connections);
    };
    
    self.getCurrentLocation = function(callbackFn) {
        if(!navigator.geolocation) {
            alert("Sorry, your device does not support geo location features! :/");
            return false;
        }
        console.log("getCurrentLocation was called");
        navigator.geolocation.getCurrentPosition(callbackFn);
    };
    
    self.getConnections = function(from, to, successCallbackFn, errorCallbackFn) {
        $http.get('https://maps.googleapis.com/maps/api/directions/json?'
            + 'origin=' + from
            + '&destination=' + to
            + '&departure_time=' + ~~(new Date().getTime() / 1000)
            + '&sensor=true&mode=transit&alternatives=true')
        .success(function(data) {
            reformatApiResponse(data, successCallbackFn);
        }).error(errorCallbackFn);
    };
    
    self.getConnectionsFromHereTo = function(destination, successCallbackFn, errorCallbackFn, statusChangedCallbackFn) {
        setStatusIfNeeded("Getting current position...", statusChangedCallbackFn);
        self.getCurrentLocation(function(position) {
            setStatusIfNeeded("Getting connections...", statusChangedCallbackFn);
            var from = position.coords.latitude + ',' + position.coords.longitude;
            console.log("Got position info");
            console.log(from);
            self.getConnections(from, destination, successCallbackFn, errorCallbackFn);
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