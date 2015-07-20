/*global angular */
'use strict';

/**
 * The main app module
 * @name app
 * @type {angular.Module}
 */
var app = angular.module('app', ['flow']).config(['flowFactoryProvider', 
  function (flowFactoryProvider) 
  {
    flowFactoryProvider.defaults = 
    {
      target: '',
      permanentErrors: [500, 501],
      maxChunkRetries: 1,
      chunkRetryInterval: 5000,
      simultaneousUploads: 1
    };

    flowFactoryProvider.on('catchAll', function (event) 
    {
      console.log('catchAll', arguments);
    });

    // Can be used with different implementations of Flow.js
    flowFactoryProvider.factory = fustyFlowFactory;

  }]);

  app.controller('ibeisCtrl', function($scope, $http) 
  {
  	var request =
  	{   
  		url: "http://131.193.42.62:5005/api/image/3",
        method: "GET",  
    }

    $.ajax(request).success(function(result) 
    {
    	//alert(result);
  		$scope.imageIBEIS = result[0].response;
    });

    $scope.openInfo = function()
    {
    	var image = new Image();
     	var image = new Image();
        image.onload = function() 
        {
        	EXIF.getData(image, function() 
        	{
        		alert(EXIF.pretty(this));
            });
        };
        image.src = document.getElementById("$index").src;
    }
   
  	$scope.inputInfo = function()
  	{
  		document.getElementById("file-input").onchange = function(e) 
  		{
  			EXIF.getData(e.target.files[0], function() 
  			{
  				alert(EXIF.pretty(this));
        	});
    	}
	}

	$scope.Imgfunc = function()
	{
		var image = new Image();
        image.onload = function() 
        {
        	EXIF.getData(image, function() 
        	{
                alert(EXIF.pretty(this));
            });
        };
        image.src = $scope.image;
      }
});