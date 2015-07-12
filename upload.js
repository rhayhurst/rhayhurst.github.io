//File, Directory, Archive, or External Image Uploader using Imgur API, HTML5 FormData, ZIPjs, and Cross-Domain XHR

            /* Traverse through files and directories */
            function traverseFileTree(item, path) {
              path = path || "";
              if (item.isFile) {
                // Get file
                item.file(function(file) {
                    if(file.type.match(/image.*/)){
                        upload(file);
                    }
                });
              } else if (item.isDirectory) {
                // Get folder contents
                var dirReader = item.createReader();
                dirReader.readEntries(function(entries) {
                  for (var i=0; i<entries.length; i++) {
                    traverseFileTree(entries[i], path + item.name + "/");
                  }
                });
              }
            }

            /* Main unzip function */
            function unzip(zip){
                model.getEntries(zip, function(entries) {
                    entries.forEach(function(entry) {
                        model.getEntryFile(entry, "Blob");
                    });
                });
            }

            /* Drag'n drop stuff */
            var drag = document.getElementById("drag");
            
            drag.ondragover = function(e) {e.preventDefault()}
            drag.ondrop = function(e) {
                e.preventDefault();
                  var length = e.dataTransfer.items.length;
                  for (var i = 0; i < length; i++) {
                    var entry = e.dataTransfer.items[i].webkitGetAsEntry();
                    var file = e.dataTransfer.files[i];
                    var zip = file.name.match(/\.zip/);
                    if (entry.isFile) {
                        if(zip){
                            unzip(file);
                        } else {
                          var file = e.dataTransfer.files[i];

                          if(file.type.match(/image.*/)){
                            upload(file);
                          } else {
                            document.getElementById("error").innerHTML = file.name+" is not an image.";
                          }                       
                        }


                    } else if (entry.isDirectory) {
                     traverseFileTree(entry);
                    }
                  }
            }

            var files = document.getElementById("filesinput");
            var directory = document.getElementById("directoryinput");
            var zipinput = document.getElementById("zipinput");
            var external = document.getElementById("external");
            var fbutton = document.getElementById("fbutton");
            var dbutton = document.getElementById("dbutton");
            var zbutton = document.getElementById("zbutton");

            //process files
            files.addEventListener("change", function (e) {
                var files = e.target.files;
                for(i=0; i<files.length; i++) {
                    var file = files[i];
                    if(file.type.match(/image.*/)){
                        upload(file);
                    }
                }
            }, false);

            //process directory
            directory.addEventListener("change", function (e) {
                var files = e.target.files;
                for (var i=0; i<files.length; i++) {
                    var file = files[i];
                    if(file.type.match(/image.*/)){
                        upload(file);
                    }
                }            
            }, false);

            //process zip archive
            zipinput.addEventListener('change', function() {
                unzip(zipinput.files[0]);
            }, false);


            external.addEventListener("click", function (e) {
                var einput = document.getElementById("einput");
                var file = einput.value;
                //matching for ending here is not ideal since lots of image are auto generated via some other url
                //if (file.match(/\.jpg|\.gif|\.jpeg|\.png/)){
                    upload(file);
                //}
            }, false);

            fbutton.addEventListener("click", function() {
                document.getElementById('filesinput').click();
            }, false);

            dbutton.addEventListener("click", function() {
                document.getElementById('directoryinput').click()
            }, false);

            zbutton.addEventListener("click", function() {
                document.getElementById('zipinput').click()
            }, false);

            /* main upload function that sends images to imgur.com */
            function upload(file) {

                document.body.className = "uploading";

                /* Lets build a FormData object*/
                var fd = new FormData();
                
                fd.append("image_zip_archive", file);
                var xhr = new XMLHttpRequest();
                var output = document.getElementById("output");
                
                xhr.open("POST", "http://131.193.42.62:5005/api/image/");
                xhr.setRequestHeader("Authorization","IBEIS:N37Z3rzJY53IjcuHHNZQK9KqqXs=");
                xhr.setRequestHeader("Secret","CB73808F-A6F6-094B-5FCD-385EBAFF8FC0");
                xhr.setRequestHeader("Username","ibeis");
                xhr.setRequestHeader("Password","ibeis");
                xhr.setRequestHeader("crossDomain",true);
                xhr.onload = function() {

                    if(this.status==400){
                       document.getElementById("error").innerHTML = JSON.parse(xhr.responseText).error.message;
                    } else {
                        var links = JSON.parse(xhr.responseText).upload.links;
                        var dimage = links.small_square;
                        var dlink = links.imgur_page;

                        var a = document.createElement("a");
                        a.href = dlink;

                        var img = document.createElement("img");
                        img.src = dimage;

                        a.appendChild(img);
                        output.appendChild(a);

                        document.body.className = "uploaded";
                    }

                }

                xhr.send(fd);
            }

            //model for zip.js
            var model = (function() {

                return {
                    getEntries : function(file, onend) {
                        zip.createReader(new zip.BlobReader(file), function(zipReader) {
                            zipReader.getEntries(onend);
                        }, onerror);
                    },
                    getEntryFile : function(entry, creationMethod, onend, onprogress) {
                        var writer, zipFileEntry;

                        function getData() {
                            entry.getData(writer, function(blob) {

                            //read the blob, grab the base64 data, send to upload function
                            oFReader = new FileReader()
                            oFReader.onloadend = function(e) {
                              upload(this.result.split(',')[1]);    
                            };
                            oFReader.readAsDataURL(blob);
                         
                            }, onprogress);
                        }
                            writer = new zip.BlobWriter();
                            getData();
                    }
                };
            })();