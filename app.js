/*global angular */
'use strict';

/**
 * The main app module
 * @name app
 * @type {angular.Module}
 */
var app = angular.module('app', ['flow']);

app.factory('photosFactory', function($http) {
 return{
    getPhotos : function(id) {
        return $http({
            url: 'http://131.193.42.62:5005/api/image/'+id,
            dataType:'jsonp',
            method: 'GET'
        })
    },
    getPath :function() {
        return $http({
            url: 'http://131.193.42.62:5005/api/image/',
            dataType:'jsonp',
            method: 'GET'
        })
    },
     getLon : function(idList)
     {
        return $http({
            url: 'http://131.193.42.62:5005/api/annot/image_gps/?aid_list=['+idList+']',
            dataType:'jsonp',
            method: 'GET'
        })
     }
 }
});
  app.controller('ibeisCtrl', function($scope, $http,photosFactory) 
  {
     
      photosFactory.getPath().success(function(data){
          $scope.arrImages=data.response;

        });
      
      $scope.imageStuff = function () 
      {
        $scope.imgs =[];
        
       angular.forEach($scope.arrImages, function (items) {
            photosFactory.getPhotos(items).success(function(data){
               $scope.imgs.push(data.response);
             });
         });
        $scope.stuffStuff();
     }

     $scope.stuffStuff = function () {
    
      var arr =[];
       angular.forEach($scope.arrImages, function (items) {
            arr.push(items);
         });

       photosFactory.getLon(arr).success(function(data){
            alert(data.response)   
      });
     }
    

   
     
    $scope.hideStuff = function(items){
      $('#'+items+'').toggle('slow');
    }

      // var requestIamge = {
      //     url: "http://131.193.42.62:5005/api/image/" + 2,
      //     dataType: 'jsonp',
      //     method: "GET" };

      // $.ajax(requestIamge).success(function(result)
      // {
       
      //     $scope.imageNum.push(result.response);
         
      //     // $('#image').html('<img style="width:200px;height:150px;" src="'+$scope.imageNum[0]+'">')
      // });

    


    $scope.openInfo = function()
    {
    	var image = new Image();
     	image.onload = function()
        {
        	EXIF.getData(image, function() 
        	{
        		alert(EXIF.pretty(this));
            });
        };
        image.src = document.getElementById("$index").src;
    };
   
  	$scope.inputInfo = function()
  	{
  		document.getElementById("file-input").onchange = function(e) 
  		{
  			EXIF.getData(e.target.files[0], function() 
  			{
  				alert(EXIF.pretty(this));
        	});
    	}
	};

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