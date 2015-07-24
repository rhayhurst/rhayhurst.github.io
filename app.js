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
         $('#map').hide();
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

    $scope.createMap = function (){
      $('#pictures').hide();
      $('#map').show();


       var locations = [
      ['Bondi Beach', -33.890542, 151.274856, 4],
      ['Coogee Beach', -33.923036, 151.259052, 5],
      ['Cronulla Beach', -34.028249, 151.157507, 3],
      ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
      ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: new google.maps.LatLng(-33.92, 151.25),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
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