/**!
 * KEditor - Kademi content editor
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.6
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap (optional), FontAwesome (optional)
 */

/***************************************************************************************************/
/* Defines Variables, Text ... */
/***************************************************************************************************/

const pagebuilderParams = Joomla.getOptions('pagebuilderParams');
var txtPhotoSettings = pagebuilderParams['photoSettings'];
var txtChangePhoto = pagebuilderParams['changePhoto'];
var txtDownloadSettings = pagebuilderParams['downloadSettings'];
var txtSetDownload = pagebuilderParams['downloadSetDownload'];
var txtDownload = pagebuilderParams['downloadTxtDownload'];
var txtAudioSettings = pagebuilderParams['photoSettings'];
var txtAudioFile = pagebuilderParams['changeAudio'];
var txtClose = pagebuilderParams['close'];

var txtAutoplay = pagebuilderParams['autoplay'];
var txtControls = pagebuilderParams['controls'];
var txtWidth = pagebuilderParams['width'];
var txtHeight = pagebuilderParams['height'];

var txtVideoSettings = pagebuilderParams['videoSettings'];

/***************************************************************************************************/
/* Audio */
/***************************************************************************************************/

(function ($) {

    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['audio'] = {


        //TODO: Get content zerstört audio beim zweiten öffnen
        /*
        getContent: function (component, keditor) {
            flog('getContent "audio" component, component');

            var componentContent = component.children('.keditor-component-content');
            var audio = componentContent.find('audio');
            audio.unwrap();

            //return componentContent.html();
        }, */

        settingEnabled: true,

        settingTitle: 'Audio Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "audio" settings', form);

            form.append(
                '<form class="form-horizontal" action="../index.php?option=com_ajax&plugin=Whykikipagebuilder&method=audioUpload&format=json" enctype="multipart/form-data">' +
                '     <div class="form-group">' +
                '         <label for="audioFileInput" class="col-sm-12">' + txtAudioFile + '</label>' +
                '         <div class="col-sm-12">' +
                '             <div class="audio-toolbar">' +
                '                 <a href="#" class="btn-audioFileInput btn btn-sm btn-primary"><i class="fa fa-upload"></i></a>' +
                '                 <input id="audioFileInput" name="audioFileInput" type="file" style="display: none" />' +
                '             </div>' +
                '         </div>' +
                '     </div>' +
                '     <div class="form-group">' +
                '         <label for="audio-autoplay" class="col-sm-12">' + txtAutoplay + '</label>' +
                '         <div class="col-sm-12">' +
                '             <input type="checkbox" id="audio-autoplay" />' +
                '         </div>' +
                '     </div>' +
                '     <div class="form-group">' +
                '         <label for="audio-showcontrols" class="col-sm-12">' + txtControls + '</label>' +
                '         <div class="col-sm-12">' +
                '             <input type="checkbox" id="audio-showcontrols" checked />' +
                '         </div>' +
                '     </div>' +
                '     <div class="form-group">' +
                '         <label for="audio-width" class="col-sm-12">' + txtWidth + ' (%)</label>' +
                '         <div class="col-sm-12">' +
                '             <input type="number" id="audio-width" min="20" max="100" class="form-control" value="100" />' +
                '         </div>' +
                '     </div>' +
                '</form>'
            );
        },




        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "audio" component', form, component);
            
            var options = keditor.options;
            
            var audio = component.find('audio');
            var fileInput = form.find('#audioFileInput');
            var btnAudioFileInput = form.find('.btn-audioFileInput');
            btnAudioFileInput.off('click').on('click', function (e) {
                e.preventDefault();
                
                fileInput.trigger('click');
            });
            fileInput.off('change').on('change', function () {
                var file = this.files[0];
                if (/audio/.test(file.type)) {
                    // Todo: Upload to your server :)

                    var blobData = URL.createObjectURL(file);

                    audio.attr('src', URL.createObjectURL(file));

                    var data = new FormData();
                    data.append('file', blobData);

                    console.log(URL.createObjectURL(file));

                    var fileName = file.name;
                    var fileType = file.type;

                    console.log(file);

                    var reader = new FileReader();
                    // this function is triggered once a call to readAsDataURL returns
                    reader.onload = function(event){
                        var fd = new FormData();
                        fd.append('filename', fileName);
                        fd.append('data', event.target.result);
                        $.ajax({
                            type: 'POST',
                            url: '../index.php?option=com_ajax&plugin=Whykikipagebuilder&method=audioUpload&format=json',
                            data: fd,
                            dataType:"json",
                            processData: false,
                            contentType: false
                        }).success(function(data) {

                            console.log(data.data);
                            var filename = data.data;

                            console.log(filename);
                            filename = filename.replace("\/","");
                            filename = '/' + filename.replace('"','');


                            audio.attr('src', filename);

                            $(document).trigger('contentchange');

                        }).done(function(data) {
                            // print the output from the upload.php script
                            var filenameNew = data;
                            console.log(filenameNew);
                        });
                    };
                    // trigger the read from the reader...
                    reader.readAsDataURL(file);


                    audio.load(function () {
                        keditor.showSettingPanel(component, options);
                        console.log('abgelegt');
                    });
                } else {
                    alert('Your selected file is not an audio file!');
                }
            });


            
            var autoplayToggle = form.find('#audio-autoplay');
            autoplayToggle.off('click').on('click', function (e) {
                if (this.checked) {
                    audio.attr('autoplay', 'autoplay');
                } else {
                    audio.removeAttr('autoplay');
                }
            });

            var showcontrolsToggle = form.find('#audio-showcontrols');
            showcontrolsToggle.off('click').on('click', function (e) {
                if (this.checked) {
                    audio.attr('controls', 'controls');
                } else {
                    audio.removeAttr('controls');
                }
            });

            var audioWidth = form.find('#audio-width');
            audioWidth.off('change').on('change', function () {
                audio.css('width', this.value + '%');
            });
        }
    };
})(jQuery);


/***************************************************************************************************/
/* Googlemap */
/***************************************************************************************************/

(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['googlemap'] = {
        getContent: function (component, keditor) {
            flog('getContent "googlemap" component', component);

            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.googlemap-cover').remove();

            return componentContent.html();
        },

        settingEnabled: true,

        settingTitle: 'Google Map Einstellungen',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "googlemap" component');

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary btn-googlemap-edit">Karte aktualisieren</button>' +
                '           <br><a href="https://developers.google.com/maps/documentation/embed/start">Mapcode erstellen</a>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Aspect Ratio</label>' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-sm btn-default btn-googlemap-169">16:9</button>' +
                '           <button type="button" class="btn btn-sm btn-default btn-googlemap-43">4:3</button>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var btnEdit = form.find('.btn-googlemap-edit');
            btnEdit.on('click', function (e) {
                e.preventDefault();

                var inputData = prompt('Please enter Google Map embed code in here:');
                var iframe = $(inputData);
                var src = iframe.attr('src');
                if (iframe.length > 0 && src && src.length > 0) {
                    keditor.getSettingComponent().find('.embed-responsive-item').attr('src', src);
                } else {
                    alert('Your Google Map embed code is invalid!');
                }
            });

            var btn169 = form.find('.btn-googlemap-169');
            btn169.on('click', function (e) {
                e.preventDefault();

                keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
            });

            var btn43 = form.find('.btn-googlemap-43');
            btn43.on('click', function (e) {
                e.preventDefault();

                keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
            });
        }
    };

})(jQuery);


/***************************************************************************************************/
/* Open Street Maps */
/***************************************************************************************************/

(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['openstreetmaps'] = {
        getContent: function (component, keditor) {
            flog('getContent "openstreetmap" component', component);

            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.googlemap-cover').remove();

            return componentContent.html();
        },

        settingEnabled: true,

        settingTitle: 'OSM Map Einstellungen',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "openstreetmap" component');

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary btn-osm-edit">Karte aktualisieren</button>' +
                '           <br><a class="btn btn-success" target="_blank" href="https://www.openstreetmap.org">Mapcode erstellen</a>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Aspect Ratio</label>' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-sm btn-default btn-osm-169">16:9</button>' +
                '           <button type="button" class="btn btn-sm btn-default btn-osm-43">4:3</button>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12"><p><h3>Hilfe:</h3><br>' +
                'Zuerst auf den Link "Mapcode erstellen" klicken und dort den gewünschten Kartenausschnitt einstellen und einen Marker setzen, wenn gewünscht. Bei Problemen hilft ggf. auch das unten stehende Bild<br>' +
                'Nach dem Ausrichten der Karte auf den Reiter "HTML" klicken und den darin stehenden Code kopieren.<br>Nun auf "Karte aktualisieren" klicken und den Code einfügen' +
                '</p><img src="../plugins/system/whykikipagebuilder/assets/images/osmMap.png"></div>' +
                '   </div>' +
                '</form>'
            );

            var btnEdit = form.find('.btn-osm-edit');
            btnEdit.on('click', function (e) {
                e.preventDefault();

                var inputData = prompt('Bitte die OSM Karten URL eintragen:');
                inputData.replace('width="425" height="350"', 'class="osmMap"');
                console.log(inputData);

                if (inputData != '') {
                    console.log(inputData);
                    $('.osmMap').replaceWith(inputData);

                } else {
                    console.log(inputData);
                    alert('Sie haben Zutritt');
                }

            });

            var btn169 = form.find('.btn-osm-169');
            btn169.on('click', function (e) {
                e.preventDefault();

                keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
            });

            var btn43 = form.find('.btn-osm-43');
            btn43.on('click', function (e) {
                e.preventDefault();

                keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
            });
        }
    };

})(jQuery);



/***************************************************************************************************/
/* Photo */
/***************************************************************************************************/

(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['photo'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "photo" component', component);
            
            var componentContent = component.children('.keditor-component-content');
            var img = componentContent.find('img');
            
            img.css('display', 'inline-block');
        },
        
        settingEnabled: true,
        
        settingTitle: txtPhotoSettings,
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "photo" component');
            
            var self = this;
            var options = keditor.options;
            $('.formSlider').remove();
            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary" id="photo-edit">' + txtChangePhoto + '</button>' +
                '           <input type="file" style="display: none" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-style" class="col-sm-12">Style</label>' +
                '       <div class="col-sm-12">' +
                '           <select id="photo-style" class="form-control">' +
                '               <option value="">None</option>' +
                '               <option value="img-rounded">Rounded</option>' +
                '               <option value="img-circle">Circle</option>' +
                '               <option value="img-thumbnail">Thumbnail</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var modal = '<div class="modal fade" id="myModal" role="dialog">' +
                '    <div class="modal-dialog">' +
                '      <div class="modal-content">' +
                '        <div class="modal-body">' +
                '          <p><iframe id="mediaManagerIframe" src="index.php?option=com_media&view=images&tmpl=component&e_name=imageurl&return_url=1"></iframe></p>' +
                '        </div> ' +
                '      </div> ' +
                '       ' +
                '    </div> ' +
                '  </div> ' +
                '   ' +
                '</div>'
            var photoEdit = form.find('#photo-edit');
            var fileInput = photoEdit.next();
            photoEdit.on('click', function (e) {


                // Add Joomla Media Manager
                /**********************************/


                $('body').append(modal);
                $("#myModal").modal();
                $('iframe').addClass('testIframe');

                // Get the iframe contents
                var imagePath;
                $("#mediaManagerIframe").load(function(){

                    // Get the input URL where image path is set

                    var inputURL = $("#mediaManagerIframe").contents().find("body").find("#f_url");
                    $("#mediaManagerIframe").contents().find("body").find(".button-save-selected").css('display','none');
                    $("#mediaManagerIframe").contents().find("body").find(".button-cancel").css('display','none');
                    $("#mediaManagerIframe").contents().find("body").find(".pull-right").append('<button class="btn btn-primary testbutton">Foto einsetzen</button>');
                    var testbutton = $("#mediaManagerIframe").contents().find("body").find(".testbutton");

                    function watchTextbox() {

                        var txtInput = inputURL;
                        var lastValue = txtInput.data('lastValue');
                        var currentValue = txtInput.val();
                        if (lastValue != currentValue) {
                            console.log('Value changed from ' + lastValue + ' to ' + currentValue);
                            txtInput.data('lastValue', currentValue);
                            imagePath = currentValue;
                        }
                    }
                    setInterval(watchTextbox, 100);

                    //
                    testbutton.on('click', function () {
                        var editorImage = keditor.getSettingComponent().find('img');
                        editorImage.attr('src','../' + imagePath);

                        e.preventDefault();
                        $("#myModal").modal('hide');
                        $(".modal-backdrop").remove();
                        $("#myModal").remove();
                        $("body").removeClass('modal-open');
                        console.log(editorImage);
                        $(document).trigger('contentchange');
                    });

                });

                e.preventDefault();

            });

            var inputAlign = form.find('#photo-align');
            inputAlign.on('change', function () {
                var panel = keditor.getSettingComponent().find('.photo-panel');
                panel.css('text-align', this.value);
            });
            
            var inputResponsive = form.find('#photo-responsive');
            inputResponsive.on('click', function () {
                keditor.getSettingComponent().find('img')[this.checked ? 'addClass' : 'removeClass']('img-responsive');
            });
            
            var cbbStyle = form.find('#photo-style');
            cbbStyle.on('change', function () {
                var img = keditor.getSettingComponent().find('img');
                var val = this.value;
                
                img.removeClass('img-rounded img-circle img-thumbnail');
                if (val) {
                    img.addClass(val);
                }
            });
            
            var inputWidth = form.find('#photo-width');
            var inputHeight = form.find('#photo-height');
            inputWidth.on('change', function () {
                var img = keditor.getSettingComponent().find('img');
                var newWidth = +this.value;
                var newHeight = Math.round(newWidth / self.ratio);
                
                if (newWidth <= 0) {
                    newWidth = self.width;
                    newHeight = self.height;
                    this.value = newWidth;
                }
                
                img.css({
                    'width': newWidth,
                    'height': newHeight
                });
                inputHeight.val(newHeight);
            });
            inputHeight.on('change', function () {
                var img = keditor.getSettingComponent().find('img');
                var newHeight = +this.value;
                var newWidth = Math.round(newHeight * self.ratio);
                
                if (newHeight <= 0) {
                    newWidth = self.width;
                    newHeight = self.height;
                    this.value = newHeight;
                }
                
                img.css({
                    'height': newHeight,
                    'width': newWidth
                });
                inputWidth.val(newWidth);
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "photo" component', component);
            
            var self = this;
            var inputAlign = form.find('#photo-align');
            var inputResponsive = form.find('#photo-responsive');
            var inputWidth = form.find('#photo-width');
            var inputHeight = form.find('#photo-height');
            var cbbStyle = form.find('#photo-style');
            
            var panel = component.find('.photo-panel');
            var img = panel.find('img');
            
            var algin = panel.css('text-align');
            if (algin !== 'right' || algin !== 'center') {
                algin = 'left';
            }
            
            if (img.hasClass('img-rounded')) {
                cbbStyle.val('img-rounded');
            } else if (img.hasClass('img-circle')) {
                cbbStyle.val('img-circle');
            } else if (img.hasClass('img-thumbnail')) {
                cbbStyle.val('img-thumbnail');
            } else {
                cbbStyle.val('');
            }
            
            inputAlign.val(algin);
            inputResponsive.prop('checked', img.hasClass('img-responsive'));
            inputWidth.val(img.width());
            inputHeight.val(img.height());
            
            $('<img />').attr('src', img.attr('src')).load(function () {
                self.ratio = this.width / this.height;
                self.width = this.width;
                self.height = this.height;
            });
        }
    };
    
})(jQuery);


/***************************************************************************************************/
/* Download */
/***************************************************************************************************/

(function ($) {

    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['download'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "download" component', component);

            var componentContent = component.children('.keditor-component-content');

        },

        settingEnabled: true,

        settingTitle: txtDownloadSettings,

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "photo" component');

            var self = this;
            var options = keditor.options;
            $('.formSlider').remove();
            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary" id="download-edit">' + txtSetDownload + '</button>' +
                '           <input type="file" style="display: none" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-style" class="col-sm-12">Settings</label>' +
                '       <div class="col-sm-12">' +
                // '           <select id="photo-style" class="form-control">' +
                // '               <option value="">Non22e</option>' +
                //'               <option value="autoWidth">Autowidth</option>' +
                //'           </select>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );


            function getJCEUrl() {
                var head = document.head.innerHTML;
                var position = head.search(/option=com_jce&amp;view=editor&amp;task=loadlanguages&amp;lang=en&amp;context=/);
                var cuttedURL = head.substring(position + 78, position + 120);
                var contentID = cuttedURL.substr(0,2);
                var endLength = cuttedURL.length;
                var jceToken = cuttedURL.substr(7,endLength - 10);

                var jceURL = 'index.php?option=com_jce&view=editor&plugin=filemanager&context=' + contentID +'&' + jceToken + '=1';
                $('#mediaManagerIframe').attr('src',jceURL);

                //console.log(n);
                return jceURL;
            }
            var newURL = getJCEUrl();

            var modal = '<div class="modal fade" id="myModal" role="dialog">' +
                '    <div class="modal-dialog">' +
                '      <div class="modal-content">' +
                '        <div class="modal-body">' +
                '          <p><iframe id="mediaManagerIframe" src="' + newURL +'"></iframe></p>' +
                '        </div> ' +
                '      </div> ' +
                '       ' +
                '    </div> ' +
                '  </div> ' +
                '   ' +
                '</div>'
            var downloadEdit = form.find('#download-edit');
            var fileInput = downloadEdit.next();

            downloadEdit.on('click', function (e) {

                // Add Joomla Media Manager
                /**********************************/


                $('body').append(modal);
                $("#myModal").modal();
                $('iframe').addClass('testIframe');

                // Get the iframe contents
                var downloadPath;
                $("#mediaManagerIframe").load(function(){

                    // Get the input URL where image path is set

                    var inputURL = $("#mediaManagerIframe").contents().find("body").find("#href");
                    $("#mediaManagerIframe").contents().find("body").find(".button-save-selected").css('display','none');
                    $("#mediaManagerIframe").contents().find("body").find(".button-cancel").css('display','none');
                    $("#mediaManagerIframe").contents().find("#browser-actions").prepend('<button class="btn btn-primary  downloadButton">' + txtSetDownload +'</button>');
                    $("#mediaManagerIframe").contents().find("#browser-actions").prepend('<button class="btn btn-primary downloadClose">' + txtClose +'</button>');
                    var downloadButton = $("#mediaManagerIframe").contents().find("body").find(".downloadButton");
                    var downloadClose = $("#mediaManagerIframe").contents().find("body").find(".downloadClose");


                    function watchTextbox() {

                        var txtInput = inputURL;
                        var lastValue = txtInput.data('lastValue');
                        var currentValue = txtInput.val();
                        if (lastValue != currentValue) {
                            console.log('Value changed from ' + lastValue + ' to ' + currentValue);
                            txtInput.data('lastValue', currentValue);
                            downloadPath = currentValue;
                        }
                    }
                    setInterval(watchTextbox, 100);

                    //
                    downloadButton.on('click', function () {

                        // Build Download HTML Structure
                        //**********************

                        var dotPosition = downloadPath.indexOf(".");
                        var downloadFileName = downloadPath.substring(0, dotPosition);
                        var downloadFileType = downloadPath.substring(downloadPath.length - 3, downloadPath.length);
                        var fileTypeIcon;
                        var fileSize =  $("#mediaManagerIframe").contents().find("body").find(".uk-comment-header").find('#info-size').text();
                        fileSize = fileSize.replace("Size: ", "");

                        var slashPosition = downloadPath.lastIndexOf("/");
                        var cleanedFilename = downloadPath.substring(slashPosition + 1, downloadPath.length);


                        switch(downloadFileType) {
                            case 'png':
                                fileTypeIcon = 'file-image-o';
                                break;
                            case 'jpg':
                                fileTypeIcon = 'file-image-o';
                                break;
                            case 'gif':
                                fileTypeIcon = 'file-image-o';
                                break;
                            case 'pdf':
                                fileTypeIcon = 'file-pdf-o';
                                break;
                            default:
                                fileTypeIcon = 'file-o';
                        }

                        var html = '<div class="downloadIcon"><i class="fa fa-' + fileTypeIcon + '"></i></div><div class="downloadInfo"><span class="downloadFileName">' + cleanedFilename + ' (' + fileSize + ') ' + '</span></div><div class="downloadButtonContainer"><a href="' + downloadPath + '" class="btn btn-primary btnDownload">' + txtDownload + '</a></div>';



                        $('.download-panel').html( html);

                        e.preventDefault();
                        $("#myModal").modal('hide');
                        $(".modal-backdrop").remove();
                        $("#myModal").remove();
                        $("body").removeClass('modal-open');
                        $(document).trigger('contentchange');
                    });

                    downloadClose.on('click', function () {
                        e.preventDefault();
                        $("#myModal").modal('hide');
                        $(".modal-backdrop").remove();
                        $("#myModal").remove();
                        $("body").removeClass('modal-open');
                        $(document).trigger('contentchange');
                    });
                });

                e.preventDefault();

            });


        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "download" component', component);

        }
    };

})(jQuery);


/***************************************************************************************************/
/* Text */
/***************************************************************************************************/


(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    CKEDITOR.disableAutoInline = true;

    // Text component
    // ---------------------------------------------------------------------
    KEditor.components['text'] = {
        options: {
            toolbarGroups: [
                {name: 'document', groups: ['mode', 'document', 'doctools']},
                {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
                {name: 'forms', groups: ['forms']},
                {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
                {name: 'links', groups: ['links']},
                {name: 'insert', groups: ['insert']},
                '/',
                {name: 'clipboard', groups: ['clipboard', 'undo']},
                {name: 'styles', groups: ['styles']},
                {name: 'colors', groups: ['colors']},
                {name: 'tools', groups: ['tools']},
                {name: 'others', groups: ['others']},
            ],
            title: false,
            allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes: allowed through
            bodyId: 'editor',
            templates_replaceContent: false,
            enterMode: 'P',
            forceEnterMode: true,
            format_tags: 'p;h1;h2;h3;h4;h5;h6',
            removePlugins: 'table,magicline,tabletools',
            removeButtons: 'Save,NewPage,Preview,Print,Templates,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,HiddenField,ImageButton,Button,Select,Textarea,TextField,Radio,Checkbox,Outdent,Indent,Blockquote,CreateDiv,Language,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,BGColor,Maximize,About,ShowBlocks,BidiLtr,BidiRtl,Flash,Image,Subscript,Superscript,Anchor',
            minimumChangeMilliseconds: 100
        },

        init: function (contentArea, container, component, keditor) {
            flog('init "text" component', component);

            var self = this;
            var options = keditor.options;

            var componentContent = component.children('.keditor-component-content');
            componentContent.prop('contenteditable', true);

            componentContent.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(contentArea, e, component);
                }

                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(contentArea, e, container);
                }

                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(contentArea, e);
                }
            });

            var editor = componentContent.ckeditor(self.options).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);

                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },

        getContent: function (component, keditor) {
            flog('getContent "text" component', component);

            var componentContent = component.find('.keditor-component-content');
            var id = componentContent.attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                return editor.getData();
            } else {
                return componentContent.html();
            }
        },

        destroy: function (component, keditor) {
            flog('destroy "text" component', component);

            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        }
    };

})(jQuery);




/***************************************************************************************************/
/* Video */
/***************************************************************************************************/


(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['video'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "video" component', component);

            var componentContent = component.children('.keditor-component-content');
            var video = componentContent.find('video');

            if (!video.parent().is('.video-wrapper')) {
                video.wrap('<div class="video-wrapper"></div>');
            }
        },

        /*
        getContent: function (component, keditor) {
            flog('getContent "video" component', component);

            var componentContent = component.children('.keditor-component-content');
            var video = componentContent.find('video');
            video.unwrap();

            return componentContent.html();
        },*/

        settingEnabled: true,

        settingTitle: 'Video Einstellungen',

        initSettingForm: function (form, keditor) {
            flog('init "video" settings', form);

            form.append(
                '<form class="form-horizontal">' +
                '    <div class="form-group">' +
                '        <label for="videoFileInput" class="col-sm-12">Video file</label>' +
                '        <div class="col-sm-12">' +
                '            <div class="video-toolbar">' +
                '                <a href="#" class="btn-videoFileInput btn btn-sm btn-primary"><i class="fa fa-upload"></i></a>' +
                '<input type="hidden" name="MAX_FILE_SIZE" value="95536269" />' +
                '                <input id="videoFileInput" type="file" style="display: none">' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '        <label for="video-autoplay" class="col-sm-12">Autoplay</label>' +
                '        <div class="col-sm-12">' +
                '            <input type="checkbox" id="video-autoplay" />' +
                '        </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '        <label for="video-loop" class="col-sm-12">Loop</label>' +
                '        <div class="col-sm-12">' +
                '            <input type="checkbox" id="video-loop" />' +
                '        </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '        <label for="video-showcontrols" class="col-sm-12">Show Controls</label>' +
                '        <div class="col-sm-12">' +
                '            <input type="checkbox" id="video-showcontrols" checked />' +
                '        </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '        <label for="" class="col-sm-12">Ratio</label>' +
                '        <div class="col-sm-12">' +
                '            <input type="radio" name="video-radio" class="video-ratio" value="4/3" checked /> 4:3' +
                '        </div>' +
                '        <div class="col-sm-12">' +
                '            <input type="radio" name="video-radio" class="video-ratio" value="16/9" /> 16:9' +
                '        </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '        <label for="video-width" class="col-sm-12">Width (px)</label>' +
                '        <div class="col-sm-12">' +
                '            <input type="number" id="video-width" min="320" max="1920" class="form-control" value="320" />' +
                '        </div>' +
                '    </div>' +
                '</form>'
            );
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "video" settings', form, component);

            var options = keditor.options;
            var video = component.find('video');
            var fileInput = form.find('#videoFileInput');
            var btnVideoFileInput = form.find('.btn-videoFileInput');
            btnVideoFileInput.on('click', function (e) {
                e.preventDefault();

                fileInput.trigger('click');
            });
            fileInput.off('change').on('change', function () {
                var file = this.files[0];
                if (/video/.test(file.type)) {
                    // Todo: Upload to your server :)

                    var blobData = URL.createObjectURL(file);

                    //video.attr('src', URL.createObjectURL(file));

                    var data = new FormData();
                    data.append('file', blobData);

                    console.log(URL.createObjectURL(file));

                    var fileName = file.name;
                    var fileType = file.type;

                    console.log(file);

                    var reader = new FileReader();
                    // this function is triggered once a call to readAsDataURL returns
                    reader.onload = function(event){
                        var fd = new FormData();
                        fd.append('filename', fileName);
                        fd.append('data', event.target.result);
                        $.ajax({
                            type: 'POST',
                            url: '../index.php?option=com_ajax&plugin=Whykikipagebuilder&method=videoUpload&format=json',
                            data: fd,
                            dataType:"json",
                            processData: false,
                            contentType: false
                        }).success(function(data) {

                            console.log(data.data);
                            var filename = data.data;
                            alert(filename);
                            console.log(filename);
                            filename = filename.replace("\/","");
                            filename = '/' + filename.replace('"','');


                            video.attr('src', filename);

                            $(document).trigger('contentchange');

                        }).error(function(error) {

                            console.log('uplaod error' + error);
                            console.log('uplaod error' + error);

                        }).done(function(data) {
                            // print the output from the upload.php script
                            var filenameNew = data.data;
                            console.log(filenameNew);
                        });
                    };
                    // trigger the read from the reader...
                    reader.readAsDataURL(file);

                    video.load(function () {
                        keditor.showSettingPanel(component, options);
                    });
                } else {
                    alert('Your selected file is not an video file!');
                }
            });

            var autoplayToggle = form.find('#video-autoplay');
            autoplayToggle.off('click').on('click', function (e) {
                if (this.checked) {
                    video.prop('autoplay', true);
                } else {
                    video.removeProp('autoplay');
                }
            });

            var loopToggle = form.find('#video-loop');
            loopToggle.off('click').on('click', function (e) {
                if (this.checked) {
                    video.prop('loop', true);
                } else {
                    video.removeProp('loop');
                }
            });

            var ratio = form.find('.video-ratio');
            ratio.off('click').on('click', function (e) {
                if (this.checked) {
                    var currentWidth = video.css('width') || video.prop('width');
                    currentWidth = currentWidth.replace('px', '');

                    var currentRatio = this.value === '16/9' ? 16 / 9 : 4 / 3;
                    var height = currentWidth / currentRatio;
                    video.css('width', currentWidth + 'px');
                    video.css('height', height + 'px');
                    video.removeProp('width');
                    video.removeProp('height');
                }
            });

            var showcontrolsToggle = form.find('#video-showcontrols');
            showcontrolsToggle.off('click').on('click', function (e) {
                if (this.checked) {
                    video.attr('controls', 'controls');
                } else {
                    video.removeAttr('controls');
                }
            });

            var videoWidth = form.find('#video-width');
            videoWidth.off('change').on('change', function () {
                video.css('width', this.value + 'px');
                var currentRatio = form.find('.video-ratio:checked').val() === '16/9' ? 16 / 9 : 4 / 3;
                var height = this.value / currentRatio;
                video.css('height', height + 'px');
                video.removeProp('width');
                video.removeProp('height');
            });
        }
    };
})(jQuery);


/***************************************************************************************************/
/* Vimeo */
/***************************************************************************************************/


(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['vimeo'] = {
        getContent: function (component, keditor) {
            flog('getContent "vimeo" component', component);

            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.vimeo-cover').remove();

            return componentContent.html();
        },

        settingEnabled: true,

        settingTitle: 'Vimeo Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "vimeo" component');

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary btn-vimeo-edit">Change Video</button>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Autoplay</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="checkbox" id="vimeo-autoplay" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Aspect Ratio</label>' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-sm btn-default btn-vimeo-169">16:9</button>' +
                '           <button type="button" class="btn btn-sm btn-default btn-vimeo-43">4:3</button>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var btnEdit = form.find('.btn-vimeo-edit');
            btnEdit.on('click', function (e) {
                e.preventDefault();

                var inputData = prompt('Please enter Vimeo URL in here:');
                var vimeoRegex = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
                var match = inputData.match(vimeoRegex);
                if (match && match[1]) {
                    keditor.getSettingComponent().find('.embed-responsive-item').attr('src', 'https://player.vimeo.com/video/' + match[1] + '?byline=0&portrait=0&badge=0');
                } else {
                    alert('Your Vimeo URL is invalid!');
                }
            });

            var btn169 = form.find('.btn-vimeo-169');
            btn169.on('click', function (e) {
                e.preventDefault();

                keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
            });

            var btn43 = form.find('.btn-vimeo-43');
            btn43.on('click', function (e) {
                e.preventDefault();

                keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
            });

            var chkAutoplay = form.find('#vimeo-autoplay');
            chkAutoplay.on('click', function () {
                var embedItem = keditor.getSettingComponent().find('.embed-responsive-item');
                var currentUrl = embedItem.attr('src');
                var newUrl = (currentUrl.replace(/(\?.+)+/, '')) + '?byline=0&portrait=0&badge=0&autoplay=' + (chkAutoplay.is(':checked') ? 1 : 0);

                flog('Current url: ' + currentUrl, 'New url: ' + newUrl);
                embedItem.attr('src', newUrl);
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "vimeo" component', component);

            var embedItem = component.find('.embed-responsive-item');
            var chkAutoplay = form.find('#vimeo-autoplay');
            var src = embedItem.attr('src');

            chkAutoplay.prop('checked', src.indexOf('autoplay=1') !== -1);
        }
    };

})(jQuery);

/***************************************************************************************************/
/* Youtube */
/***************************************************************************************************/

(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['youtube'] = {
        getContent: function (component, keditor) {
            flog('getContent "youtube" component', component);

            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.youtube-cover').remove();

            return componentContent.html();
        },

        settingEnabled: true,

        settingTitle: 'Youtube Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "youtube" component');

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary btn-youtube-edit">Change Video</button>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Autoplay</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="checkbox" id="youtube-autoplay" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Aspect Ratio</label>' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-sm btn-default btn-youtube-169">16:9</button>' +
                '           <button type="button" class="btn btn-sm btn-default btn-youtube-43">4:3</button>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var btnEdit = form.find('.btn-youtube-edit');
            btnEdit.on('click', function (e) {
                e.preventDefault();

                var inputData = prompt('Please enter Youtube URL in here:');
                var youtubeRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/;
                var match = inputData.match(youtubeRegex);
                if (match && match[1]) {
                    keditor.getSettingComponent().find('.embed-responsive-item').attr('src', 'https://www.youtube-nocookie.com/embed/' + match[1]);
                } else {
                    alert('Your Youtube URL is invalid!');
                }
            });

            var btn169 = form.find('.btn-youtube-169');
            btn169.on('click', function (e) {
                e.preventDefault();

                keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
            });

            var btn43 = form.find('.btn-youtube-43');
            btn43.on('click', function (e) {
                e.preventDefault();

                keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
            });

            var chkAutoplay = form.find('#youtube-autoplay');
            chkAutoplay.on('click', function () {
                var embedItem = keditor.getSettingComponent().find('.embed-responsive-item');
                var currentUrl = embedItem.attr('src');
                var newUrl = (currentUrl.replace(/(\?.+)+/, '')) + '?autoplay=' + (chkAutoplay.is(':checked') ? 1 : 0);

                flog('Current url: ' + currentUrl, 'New url: ' + newUrl);
                embedItem.attr('src', newUrl);
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "youtube" component', component);

            var embedItem = component.find('.embed-responsive-item');
            var chkAutoplay = form.find('#youtube-autoplay');
            var src = embedItem.attr('src');

            chkAutoplay.prop('checked', src.indexOf('autoplay=1') !== -1);
        }
    };

})(jQuery);

