
var app = angular.module('myApp', ['ui.router']);

// Wraps a promise in an object, so that the resolver considers the dependency
// immediately resolved, but the promise can still be accessed later.
app.service('nonMandatory', function() {
  return function(promise) {
    return { promise: promise };
  };
});

app.config(function($stateProvider) {

  $stateProvider.state('root', {
    abstract: true,
    template: "<div>{{ message }}</div><div ui-view></div></div>",
    resolve: {
      message: function(nonMandatory, $q) {
        // think of the call to $q.when as a call to the poller.
        return nonMandatory($q.when("Hello from ui-router land!"));
      }
    },
    controller: function($scope, message) {
      message.promise.then(function(value){
        $scope.message = "Root state [" + value + "]";
      });
    }
  });

  $stateProvider.state('root.foo', {
    url: '',
    abstract: false,
    template: "<p>{{ message }}</p>",
    resolve: {
      message: function(message) {
        return message.promise;
      }
    },
    controller: function($scope, message) {
      $scope.message = "Foo state: [" + message + "]";
    }
  });
});

app.run(function($rootScope) {
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    console.error(error);
  });
});
