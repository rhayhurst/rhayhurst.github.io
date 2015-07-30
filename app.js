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
                url: 'http://131.193.42.62:5005/api/image/' + id,
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
        postLon: function (idList, coord) {
            return $http({
                url: 'http://131.193.42.62:5005/api/image/gps/?gid_list=[' + idList + ':[' + coord + ']]',
                //gid_list: (coord),
                dataType: 'jsonp',
                method: 'PUT'
            })
        }
    }
});
app.controller('ibeisCtrl', function ($scope, $http, $compile, photosFactory) {
    $scope.hideTable = true;
    var coord =
   [
       ['04.813745', '38.824375'],
       ['04.834565', ' 38.834567'],
       ['04.839876', ' 38.834567'],
       ['04.845678', '38.845678'],
       ['04.856789', '38.856789'],
       ['04.867890', ' 38.867890'],
       ['04.878890', ' 38.878901'],
       ['04.889012', ' 38.889012'],
       ['04.890125', ' 38.890123'],
       ['04.801234', ' 38.801234'],

       ['03.786833', ' 38.005452'],
       ['03.791234', ' 38.012345'],
       ['03.701234', ' 38.023456'],
       ['03.712345', '38.034567'],
       ['03.723456', '38.045678'],
       ['03.734567', '38.056789'],
       ['03.745678', '38.067890'],
       ['03.756789', '38.078901'],
       ['03.767890', '38.089012'],
       ['03.778901', '38.090123'],

       ['02.989213', '38.735361'],
       ['02.990124', '38.790124'],
       ['02.901234', '38.701234'],
       ['02.912345', ' 38.712345'],
       ['02.923456', ' 38.723456'],
       ['02.934567', ' 38.734567'],
       ['02.945678', ' 38.745678'],
       ['02.956789', ' 38.756789'],
       ['02.967890', ' 38.767890'],
       ['02.978901', '  38.778901'],

       ['06.6314361', '40.029256'],
       ['06.645678', '40.001234'],
       ['06.656789', '40.012345'],
       ['06.667890', '40.023456'],
       ['06.678901', '40.034567'],
       ['06.689012', ' 40.045678'],
       ['06.690123', ' 40.056789'],
       ['06.601234', '40.067890'],
       ['06.612345', '40.078901'],
       ['06.623456', '40.090123'],

       ['06.785300', '38.247497'],
       ['06.790123', '38.256789'],
       ['06.701234', '38.267890'],
       ['06.712345', '38.278901'],
       ['06.723456', '38.289012'],
       ['06.734567', ' 38.290123'],
       ['06.745678', ' 38.201234'],
       ['06.756789', ' 38.212345'],
       ['06.767890', '38.223456'],
       ['06.778901', '38.234567'],

       ['05.469270', ' 36.763333'],
       ['05.478901', ' 36.778901'],
       ['05.489012', '36.789012'],
       ['05.490123', '36.790123'],
       ['05.401234', '36.701234'],
       ['05.412345', '36.712345'],
       ['05.423456', '36.723456'],
       ['05.434567', '36.734567'],
       ['05.445678', '36.745678'],
       ['05.456789', '36.756789'],

       ['05.469250', '36.763333'],
       ['05.478901', '36.778901'],
       ['05.489012', '36.789012'],
       ['05.490123', '36.790123'],
       ['05.401234', ' 36.701234'],
       ['05.412345', ' 36.712345'],
       ['05.423456', '36.723456'],
       ['05.434567', ' 36.734567'],
       ['05.445678', ' 36.745678'],
       ['05.456789', '36.756789'],

       ['06.099028', '35.858556'],
       ['06.001234', ' 35.190123'],
       ['06.012345', '35.101234'],
       ['06.023456', ' 35.112345'],
       ['06.034567', '35.123456'],
       ['06.045678', '35.134567'],
       ['06.056789', '35.145678'],
       ['06.067890', '35.156789'],
       ['06.078901', '35.167890'],
       ['06.001234', '35.178901'],

       ['07.330333', ' 37.482444'],
       ['07.345678', ' 37.401234'],
       ['07.356789', '37.412345'],
       ['07.367890', ' 37.423456'],
       ['07.378901', '37.434567'],
       ['07.389012', ' 37.445678'],
       ['07.390123', ' 37.456789'],
       ['07.301234', '37.467890'],
       ['07.312345', '37.478901'],
       ['07.323456', '37.489012'],

       ['08.859294', '34.543944'],
       ['08.867890', '34.556789'],
       ['08.878901', '34.567890'],
       ['08.889012', ' 34.578901'],
       ['08.890123', '34.589012'],
       ['08.801234', ' 34.590123'],
       ['08.812345', ' 34.501234'],
       ['08.823456', '34.512345'],
       ['08.834567', '34.523456'],

       ['05.868194', '33.424722'],
       ['05.878901', '33.412345'],
       ['05.889012', '33.423456'],
       ['05.890123', ' 33.434567'],
       ['05.801234', '33.445678'],
       ['05.812345', '33.456789'],
       ['05.823456', '33.467890'],
       ['05.834567', '33.478901'],
       ['05.845678', '33.465344'],
       ['05.856789', '33.475646'],

       ['03.293594', ' 35.045691'],
       ['03.201235', ' 35.056789'],
       ['03.212345', ' 35.067890'],
       ['03.223456', '35.078901'],
       ['03.234567', '35.089012'],
       ['03.245678', '35.001234'],
       ['03.256789', '35.012345'],
       ['03.267890', '35.023456'],
       ['03.278901', '35.034567'],
       ['03.289012', ' 35.045678'],

       ['01.825438', '36.656508'],
       ['01.834564', ' 36.667890'],
       ['01.845678', ' 36.678901'],
       ['01.856789', ' 36.689012'],
       ['01.867890', ' 36.690123'],
       ['01.878901', '36.601234'],
       ['01.889012', '36.612345'],
       ['01.890123', '36.623456'],
       ['01.801234', '36.634567'],
       ['01.812345', '36.645778'],

       ['11.397383', ' 39.411308'],
       ['11.301234', ' 39.412345'],
       ['11.312345', ' 39.423456'],
       ['11.323456', ' 39.434567'],
       ['11.334567', ' 39.445678'],
       ['11.345678', ' 39.456789'],
       ['11.356789', '39.467890'],
       ['11.367890', '39.478901'],
       ['11.378901', '39.489013'],
       ['11.389012', '39.401343'],

       ['05.349325', '44.968672'],
       ['05.356789', ' 44.978901'],
       ['05.367890', ' 44.989012'],
       ['05.378901', ' 44.990123'],
       ['05.389012', '44.901234'],
       ['05.390123', ' 44.912345'],
       ['05.301234', '44.923456'],
       ['05.312345', ' 44.934567'],
       ['05.323456', ' 44.945678'],
       ['05.334567', ' 44.956789'],

       ['02.537725', '39.518580'],
       ['02.545678', '39.501234'],
       ['02.556789', ' 39.512345'],
       ['02.567890', ' 39.523456'],
       ['02.578901', '39.534567'],
       ['02.589012', ' 39.545678'],
       ['02.590123', '39.556789'],
       ['02.501234', ' 39.567890'],
       ['02.512345', ' 39.578901'],
       ['02.523456', ' 39.589012'],
       ['02.534567', ' 39.590123'],

       ['01.362491', ' 37.552528'],
       ['01.378901', ' 37.512345'],
       ['01.389012', ' 37.523456'],
       ['01.390123', ' 37.534567'],
       ['01.312345', ' 37.545678'],
       ['01.323456', '37.556789'],
       ['01.334567', ' 37.567890'],
       ['01.345678', ' 37.578901'],
       ['01.356789', ' 37.589012'],
       ['01.393572', ' 37.590123'],
       ['01.372578', ' 37.501234'],
       ['01.382468', ' 37.584568'],
       ['01.376525', '37.592568'],
       ['01.388822', '37.596542'],
       ['01.300000', '37.592575']
   ];
    photosFactory.getPath().success(function (data) {
        $scope.arrImages = data.response;

    });

    $scope.imageStuff = function () {
        $scope.hideTable = true;
        $scope.removeImages = false;
        $('#map_content').hide();

        $scope.imgs = [];

        angular.forEach($scope.arrImages, function (items) {
            photosFactory.getPhotos(items).success(function (data) {
                $scope.imgs.push(data.response);
            });
        });
    }
    $scope.ImportImages = function () {

        $scope.removeImages = true;
        document.getElementById('submitImages').removeAttribute('disabled');
        document.getElementById('cancel').removeAttribute('disabled');
        $('#map_content').hide();
        $("#drag").show();
        $scope.hideTable = true;
        $("#image_content").show();
      
    }
    $scope.tableStuff = function () {
        $scope.hideTable = false;
        $scope.removeImages = true;
        $("#drag").hide();
        $("#image_content").hide();
        $('#map_content').hide();
        $scope.imgs = [];
        angular.forEach($scope.arrImages, function (items) {
            photosFactory.getPhotos(items).success(function (data) {
                $scope.imgs.push(data.response);
            });
        });
    }
    
    $scope.stuffStuff = function () {
        $scope.hideTable = true;
        var arr = [];
        var location = [];
        $scope.removeImages = true;
        $("#image_content").hide();
        $("#image_content").hide();
        $("#drag").hide();

        angular.forEach($scope.arrImages, function (items) {
            arr.push(items);
            //photosFactory.postLon(items,coord[items]).success(function (data) {
            //    alert(data.response);
            //});
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
    $scope.submitStuff = function () {
        $scope.hideTable = true;
        $scope.removeImages = true;
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

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
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