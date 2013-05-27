window.Direxio.directive('connection', function() {
    return {
        restrict: 'E',
        scope: {
            connection: '@data'
        },
        controller: function($scope, $element, $attrs) {
            $scope.notifyMe = function(connection) {
                if(window.webkitNotifications && (window.webkitNotifications.checkPermission() == 0)) {
                   var whenToNotify = connection.leave.getTime() - new Date().getTime();
                   setTimeout(function() {
                       window.webkitNotifications.createNotification('/img/icon.png', 'Time to leave!', 'Leave now, if you want to get your public transit connection!').show();
                   }, whenToNotify);
                   alert("You will get notified, when you have to leave for this connection!");
                }
            };
            
            $scope.expand = function() {
                $scope.$parent.$parent.expandedId = $scope.$id;
                var map = new google.maps.Map(document.getElementById('map_me_baby_' + $scope.$id), {
                    zoom: 13,
                    center: new google.maps.LatLng($scope.connection.start_location.lat, $scope.connection.start_location.lng),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            };
            
            $scope.isExpanded = function() {
                return $scope.$id === $scope.$parent.$parent.expandedId;
            }
        },
        link: function(scope, element, attrs) {
            attrs.$observe('data', function(connection) {
                var connectionObj = JSON.parse(connection);
                if(connectionObj.steps[0].travel_mode === "WALKING") {
                    connectionObj.leave = new Date(connectionObj.departureTime * 1000 - connectionObj.steps[0].duration.value * 1000);
                }
                scope.connection = connectionObj;
            });
            
        },
        template: '<div>'
            + '<div class="connection-title" ng-click="expand()">{{connection.displayText}}, leave at {{connection.leave.toTimeString()}}</div>'                        
            + '<div class="connection-details" ng-class="{expanded: isExpanded()}"><ul class="connection-instructions">' //Starting connection details & instructions           
            + '<div id="map_me_baby_{{$id}}" class="map" style="height:300px;width:300px"></div>'
            + '<p>Departure at {{connection.departure_time.text}}, arriving at {{connection.arrival_time.text}} ({{connection.duration.text}})</p>'
            + '<li ng-repeat="step in connection.steps">{{step.html_instructions}}</li>'
            + '</ul>' //Ending instruction container
            + '<button ng-click="notifyMe(connection)">Notify me for this</button>'
            + '</div>' //Ending connection details container
            + '</div>',
        replace: true
    };
});