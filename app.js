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

app.factory('photosFactory', function ($http) {

    return {
        getPhotos: function (id) {
            return $http({
                url: 'http://131.193.42.62:5005/api/annot/' + id,
                dataType: 'jsonp',
                method: 'GET'
            })
        },
        getPath: function () {
            return $http({
                url: 'http://131.193.42.62:5005/api/annot/',
                dataType: 'jsonp',
                method: 'GET'
            })
        },
        getLon: function (idList) {
            return $http({
                url: 'http://131.193.42.62:5005/api/annot/image_gps/?aid_list=[' + idList + ']',
                dataType: 'jsonp',
                method: 'GET'
            })
        },
        getName: function (idList) {
            return $http({
                url: 'http://131.193.42.62:5005/api/image/gnames/?gid_list=[' + idList + ']',
                dataType: 'jsonp',
                method: 'GET'
            })
        },
        postLon: function (idList, coord) {
            return $http({
                url: 'http://131.193.42.62:5005/api/image/gps/',
                gid_list: (idList),
                gps_list: (coord),
                dataType: 'jsonp',
                method: 'PUT'
            })
        }, 
        getTableImage: function (idList) {
            var tableImage = [{ img: {}, imageName: {}, imageGPS: {} }];

            var arr = [];
            var arr1 = [];
            var arr2 = []
            angular.forEach(idList, function (items) {
                $http({
                    url: 'http://131.193.42.62:5005/api/image/' + items ,
                    dataType: 'jsonp',
                    method: 'GET'
                }).success(function (data) {
                       arr.push(data.response);
                });
               
            })

            $http({
                url: 'http://131.193.42.62:5005/api/image/gnames/?gid_list=[' + idList + ']',
                dataType: 'jsonp',
                method: 'GET'
            }).success(function(data){
                angular.forEach(data.response, function (items) { 
                    arr1.push(items );
                })
            });
            $http({
                url: 'http://131.193.42.62:5005/api/annot/image_gps/?aid_list=[' + idList + ']',
                dataType: 'jsonp',
                method: 'GET'
            }).success(function(data){
                angular.forEach(data.response, function (items) {
                   arr2.push([items[0], items[1]]); 
                })
            });
            tableImage.img = arr;
            tableImage.imageName = arr1;
            tableImage.imageGPS = arr2;

            return tableImage;
        },
    }
});
app.directive('cancelUploadfile', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.bind('click', function (e) {
                angular.element(e.target).siblings('#cancelAll').trigger('click');
            });
        }
    };
});
app.controller('ibeisCtrl', function ($scope, $http, $compile, photosFactory) {
    $scope.hideTable = true;

    $scope.turnOnSelectImages = function(){
        $('#selectImage').prop('disabled',false);
        $('#selectImage span').html('SELECT IMAGES');

    }
    photosFactory.getPath().success(function (data) {
        $scope.arrImages = data.response;

    });
   $scope.selectAll = function(){

           $('.checkbox').each(function() { //loop through each checkbox
               this.checked = true;  //select all checkboxes with class "checkbox1"
           });


   }
    $scope.deselectAll = function(){

        $('.checkbox').each(function() { //loop through each checkbox
            this.checked = false;  //select all checkboxes with class "checkbox1"
        });


    }
    $scope.removeSelected = function(){

        $('.checkbox').each(function(data) { //loop through each checkbox
            if(this.checked == true)  {
                var imgInstruction = $('.gallery-box img')[data];
                var targetDisplay = $('.gallery-box')[data];
                imgInstruction.src ='';
                targetDisplay.innerHTML='';

            }//select all checkboxes with class "checkbox1"

        });



    }
    $scope.imageStuff = function () {
        $scope.hideTable = true;
        $scope.removeImages = false;
        $('#map_content').hide();
        $("#drag").hide();
        $('#tableDisplay').hide();
        $scope.imgs = [];
        angular.forEach($scope.arrImages, function (items) {
            photosFactory.getPhotos(items).success(function (data) {
                $scope.imgs.push(data.response);
            });
        });
        return $scope.imgs;

    }
    $scope.ImportImages = function () {
        $('#selectImage span').html('DONE WITH SELECTION');
        $scope.removeImages = true;
        $('#map_content').hide();
        $("#drag").show();
        $scope.hideTable = true;
        $("#image_content").show();
        $("#cancelAll").hide();
        $('#tableDisplay').hide();
    }

    $scope.getTableImage = function () {
        $('#tableDisplay').show();
        $("#map_content").hide();
        $("#cancelAll").hide();
        $scope.hideTable = false;
        $scope.removeImages = true;
        $('#gridDisplay').attr("display", "none");
        $("#drag").hide();
        $("#image_content").hide();
        $(function () {
            $scope.imgTable = photosFactory.getTableImage($scope.arrImages);
        })
      
    }
    $scope.mapStuff = function () {
        $("#cancelAll").hide();
        $('#tableDisplay').hide();
        $scope.hideTable = true;
        var arr = [];
        var location = [];
        $scope.removeImages = true;
        $("#image_content").hide();
        $("#image_content").hide();
        $("#drag").hide();

        angular.forEach($scope.arrImages, function (items) {
            arr.push(items);
            
        });
        //photosFactory.postLon(arr,coord).success(function (data) {
        //    alert(data.response);
        //});
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
    $scope.submitStuff = function () {
        $scope.hideTable = true;
        $scope.removeImages = true;
        $("#cancelAll").show();
        $('#map_content').hide();
       
        for (var j = 0; j < storeFile.length; j++) {
            upload(storeFile[j]);
        }
        if (zipStore.length>0) {
            unzip(zipinput.files[0]);
        }
        storeFile = [];
        zipStore = [];

    }

    $scope.hideStuff = function (items) {
        $('#' + items + '').toggle('slow');
    }
   
    $scope.createMap = function (locations) {
        
        $scope.removeImages = true;
        $('#map_content').show();

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infowindow = new google.maps.InfoWindow();

        var marker, i;

        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][0], locations[i][1]),
                map: map
            });
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent("Hi There!");
                    map.setZoom(16);
                    map.setCenter(marker.getPosition());
                    map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                    infowindow.open(map, marker);
                }
            })(marker, i));
           
        }
        var latLng = marker.getPosition();
        map.setCenter(latLng);
       
        
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