window.Direxio.directive('connection', [ 'notificationSvc', function(notificationSvc) {
    return {
        restrict: 'E',
        scope: {
            connection: '@data'
        },
        controller: function($scope, $element, $attrs) {
            var map = null;
            $scope.notifyMe = function(connection) {
                var whenToNotify = connection.leave.getTime() - new Date().getTime();
                notificationSvc.notify('/img/icon.png', 'Time to leave!', 'Leave for your connection!', whenToNotify);
            };

            $scope.isMapShown = false;
            $scope.showMap = function() {
                $scope.isMapShown = true;
                //TODO Make this work properly :(
                setTimeout(function() {
                    google.maps.event.trigger(map, 'resize');
                    map.setZoom( map.getZoom() );
                }, 0);
            }
                                                
            $scope.expand = function() {
                if($scope.isExpanded()) {
                    $scope.$parent.$parent.expandedId = null;
                } else {
                    $scope.$parent.$parent.expandedId = $scope.$id;
                }
                var boundaries = {
                    northeast: new google.maps.LatLng(
                        $scope.connection.bounds.northeast.lat, 
                        $scope.connection.bounds.northeast.lng
                    ),
                    southwest: new google.maps.LatLng(
                        $scope.connection.bounds.southwest.lat,
                        $scope.connection.bounds.southwest.lng
                    )                    
                };
                map = new google.maps.Map(document.getElementById('map_' + $scope.$id), {
                    zoom: 13,
                    center: new google.maps.LatLng($scope.connection.start_location.lat, $scope.connection.start_location.lng),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                map.fitBounds(new google.maps.LatLngBounds(boundaries.southwest, boundaries.northeast));
                
                var polyPoints = [];
                for(var i=0, len = $scope.connection.steps.length; i<len; i++) {
                    var step = $scope.connection.steps[i].start_location;
                    var latLng = new google.maps.LatLng(step.lat, step.lng);
                    polyPoints.push(latLng);
                    new google.maps.Marker({position: latLng, map: map});
                }
                var end = $scope.connection.end_location;
                polyPoints.push(new google.maps.LatLng(end.lat, end.lng));
                
                var path = new google.maps.Polyline({
                    path: polyPoints,
                    strokeColor: '#0093d5',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    map: map
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
                    connectionObj.leave = new Date(connectionObj.departureTime * 1000);
                    connectionObj.leaveText = ", leave in " + moment(connectionObj.leave).fromNow();
                }
                scope.connection = connectionObj;
            });
            
        },
        template: '<li class="connection-item">'
            + '<div class="connection-title" ng-click="expand()">{{connection.displayText}} {{connection.leaveText}}</div>'                        
            + '<div class="connection-details" ng-class="{expanded: isExpanded()}">' //Starting connection details           
            + '<div id="map_{{$id}}" class="map" ng-class="{visible: isMapShown}"></div>'
            + '<p>Departure at {{connection.departure_time.text}}, arriving at {{connection.arrival_time.text}} ({{connection.duration.text}})</p>'
            + '<ul class="connection-instructions">' // Starting instruction container     
            + '<li ng-repeat="step in connection.steps">'
            + '{{step.html_instructions}} '
            + '<span ng-show="step.transit_details">({{step.transit_details.departure_time.text}} from {{step.transit_details.departure_stop.name}})</span>'
            + '</li>'
            + '</ul>' //Ending instruction container
            + '<button ng-click="notifyMe(connection)">Notify me for this</button>'
            + '<button class="small-screen-only" ng-click="showMap()">Show on map</button>'
            + '<p class="copyright">{{connection.copyrights}}</p>'
            + '</div>' //Ending connection details container
            + '</div>',
        replace: true
    };
}]);