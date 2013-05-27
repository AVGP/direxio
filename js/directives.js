window.Direxio.directive('connection', function() {
    return {
        restrict: 'E',
        scope: { connection: '@data'},
        controller: function($scope, $element, $attrs) {
/*            $scope.$watch('connection', function(connection) {
                $scope.connection = JSON.parse(connection).displayText;
            });*/
        },
        link: function(scope, element, attrs) {
            attrs.$observe('data', function(connection) {
                scope.connection = JSON.parse(connection);
            });
        },
        template: '<div>{{connection.displayText}}</div>',
        replace: true
    };
});