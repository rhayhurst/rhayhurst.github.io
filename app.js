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
            url: 'http://131.193.42.62:5005/api/annot/'+id,
            dataType:'jsonp',
            method: 'GET'
        })
    },
    getPath :function() {
        return $http({
            url: 'http://131.193.42.62:5005/api/annot/',
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
          $scope.removeImages = false;
          $('#map').hide();
         
        $scope.imgs =[];
        
       angular.forEach($scope.arrImages, function (items) {
            photosFactory.getPhotos(items).success(function(data){
               $scope.imgs.push(data.response);
             });
         });
     }

      $scope.stuffStuff = function () {

          var arr = [];
          var location = [];
          angular.forEach($scope.arrImages, function (items) {
              arr.push(items);
          });

          photosFactory.getLon(arr).success(function (data) {
              //alert(data.response)   
              angular.forEach(data.response, function (items) {
                  if ((items[0] && items[1]) != -1) {
                      location.push([items[0], items[1]])
                  }
              })
              $scope.createMap(location);
          });
      }
      $scope.detailStuff = function () {

      }
     
    $scope.hideStuff = function(items){
      $('#'+items+'').toggle('slow');
    }

    $scope.createMap = function (locations) {
        $scope.removeImages = true;
      $('#map').show();
      
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: new google.maps.LatLng(locations[0][0], locations[0][1]),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][0], locations[i][1]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
     }
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

    


 //    $scope.openInfo = function()
 //    {
 //    	var image = new Image();
 //     	image.onload = function()
 //        {
 //        	EXIF.getData(image, function() 
 //        	{
 //        		alert(EXIF.pretty(this));
 //            });
 //        };
 //        image.src = document.getElementById("$index").src;
 //    };
   
 //  	$scope.inputInfo = function()
 //  	{
 //  		document.getElementById("file-input").onchange = function(e) 
 //  		{
 //  			EXIF.getData(e.target.files[0], function() 
 //  			{
 //  				alert(EXIF.pretty(this));
 //        	});
 //    	}
	// };

	// $scope.Imgfunc = function()
	// {
	// 	var image = new Image();
 //        image.onload = function() 
 //        {
 //        	EXIF.getData(image, function() 
 //        	{
 //                alert(EXIF.pretty(this));
 //            });
 //        };
 //        image.src = $scope.image;
 //      }
});