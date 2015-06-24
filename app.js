/*global angular */
'use strict';

/**
 * The main app module
 * @name app
 * @type {angular.Module}
 */
var app = angular.module('app', ['flow'])
  .config(['flowFactoryProvider', function (flowFactoryProvider) {
    flowFactoryProvider.defaults = {
      target: '',
      permanentErrors: [500, 501],
      maxChunkRetries: 1,
      chunkRetryInterval: 5000,
      simultaneousUploads: 1
    };
    flowFactoryProvider.on('catchAll', function (event) {
      console.log('catchAll', arguments);
    });
    // Can be used with different implementations of Flow.js
    flowFactoryProvider.factory = fustyFlowFactory;
  }]);
  app.controller('ibeisCtrl', function($scope, $http) 
  {
 
      var request ={   
        url: "http://131.193.42.62:5005/api/image/2",
        method: "GET",
        crossDomain: true,
        dataType: 'jsonp',
        headers: {
            'Authorization': 'IBEIS:N37Z3rzJY53IjcuHHNZQK9KqqXs=',
        }
     }

  $.ajax(request).success(function(result) {
  $scope.image =  result.response;
  });
 
});