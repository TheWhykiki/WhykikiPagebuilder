/*

$(function () {
    $('#content-area').keditor({
        containerSettingEnabled: false,
        containerSettingInitFunction: function (form, keditor) {
            // Add control for settings form
            form.append(
                '<div class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <label>Background color</label>' +
                '           <input type="text" class="form-control txt-bg-color" />' +
                '       </div>' +
                '   </div>' +
                '</div>'
            );

            // Add event handle for background color textbox
            form.find('.txt-bg-color').on('change', function () {
                // Get current setting container
                var container = keditor.getSettingContainer();
                // Find '.row' for setting background color
                // Note: Make sure you have a div for setting background color
                var row = container.find('.row');
                // Set background color with value of textbox
                row.css('background-color', this.value);
            });
        }
    });
});

*/




$(function () {

    /*****************************************************************************************************************/
    // Getting values set by onPrepareForm -> Joomla
    /*****************************************************************************************************************/

    const currentID = Joomla.getOptions('currentID');
    //var backwardStep = parseInt(0) ;

    /*****************************************************************************************************************/
    // Code editor
    /*****************************************************************************************************************/

    ace.config.set('basePath', '/plugins/system/whykikipagebuilder/assets/plugins/ace/');
    ace.config.set('modePath', '/plugins/system/whykikipagebuilder/assets/plugins/ace/');
    ace.config.set('themePath', '/plugins/system/whykikipagebuilder/assets/plugins/ace/');

    var codeEditor = ace.edit('codepreview', {
        mode: "ace/mode/javascript",
        selectionStyle: "text",
        highlightActiveLine: true,
        highlightSelectedWord: true,
        minLines: 50,
        wrap: true,   // wrap text to view
        indentedSoftWrap: true,
    });

    $('.ace_editor').addClass('ace-twilight');

    /*****************************************************************************************************************/
    // Prevent submitting when click in KEditor
    /*****************************************************************************************************************/

    $('#content-area').on('click', function (e) {
        e.preventDefault();
    });

    $('.btnCollapse').on('click', function (e) {
        e.preventDefault();
    });





    /*****************************************************************************************************************/
    // Categories
    /*****************************************************************************************************************/

    function getCats(){
        var cats = $('#jform_catid').html();

        html = '<select id="catsCopied" name="catsCopied" >';
        html += cats;
        html += '</select>';

        $('#toolbar-apply').append(html);
    }
    getCats();

    $('#catsCopied').change(function() {

        var idx = parseInt(this.selectedIndex);
        var selectedBefore = parseInt($("#jform_catid").prop('selectedIndex'));
        console.log('Selected: ' + idx);
        console.log('Bevore: ' + selectedBefore);

        $('#jform_catid>option:eq(' + idx + ')').attr('selected', true);
        $('#jform_catid>option:eq(' + selectedBefore + ')').attr('selected', false);
    });


    /*****************************************************************************************************************/
    // Initialize editor
    /*****************************************************************************************************************/

    $('#content-area').keditor();

    // Trigger changes 1st for code editor

    $('.editor').addClass('wf-editor-toggle-off');

    // Set content on keditor when is loaded and not empty


    /*
    var currentContent = $('#jform_fulltext').val();

    console.log('curr' + currentContent);

    if (currentContent != '') {

        $('#content-area').html(currentContent);
        //$('.keditor-content-area').keditor('setContent', '<section><div class="row"><div class="col-md-6" data-type="container-content"><section data-type="component-text">New content</section></div></div></section>');
    }

    */



    $('.keditor-ui button').on('click',function(e){
            e.preventDefault();
    });

    $('.keditor-ui a').on('click',function(e){
        e.preventDefault();
    });


    /*****************************************************************************************************************/
    // Trigger changes in Codeeditor
    /*****************************************************************************************************************/

    codeEditor.on('blur',function(){
        var codeContent = codeEditor.getValue();
        $('#content-area').keditor('setContent', codeContent);
    });

    /*****************************************************************************************************************/
    // Testerbutton
    /*****************************************************************************************************************/

    $('.testerButton').on('click',function(){
        var codeContent = codeEditor.getValue();
        $('#content-area').keditor('setContent', codeContent);
    });

    /*****************************************************************************************************************/
    // Trigger changes in Keditor and set codeeditor
    /*****************************************************************************************************************/


    $(document).on('contentchange', function (e) {
        e.preventDefault();
        var editorContent = $('#content-area').keditor('getContent');
        var withoutSection = $('#content-area').keditor('getContentWithoutSection');

        $('#jform_whykikipagebuilder').val(editorContent);
        $('#jform_withoutsections').val(withoutSection);
        $('#debugcode').val(withoutSection);
        $('#cleaned').html(withoutSection);
        codeEditor.getSession().setValue(editorContent);
        console.log('changed');

        //$("keditor-toolbar").remove
    });



    /*****************************************************************************************************************/
    // Write history
    /*****************************************************************************************************************/

    $('#content-area').focusout(function () {
        console.log('blurred keditor');
        $(document).trigger('historyWrite');
    });

    codeEditor.on('blur',function(){
        console.log('blurred code');
        $(document).trigger('historyWrite');
    });


    $(document).on('historyWrite',function(){
        //alert($('#jform_whykikipagebuilder').val());
        var historyToWrite = $('#jform_whykikipagebuilder').val();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "../index.php?option=com_ajax&plugin=Whykikipagebuilder&method=writeHistory&format=json",
            data: { history: historyToWrite, currentID: currentID} ,
            success: function(data) {
                console.log("Form submitted successfully.\nReturned json: " + data["json"]);

            }
        });
        getHistoryRecords();
    });


    /*****************************************************************************************************************/
    // Get history
    /*****************************************************************************************************************/

    var backwardStep ;
    var maxRecords;
    function getHistoryRecords() {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "../index.php?option=com_ajax&plugin=Whykikipagebuilder&method=getHistoryStep&format=json",
            data: { currentID: currentID},
            success: function(data) {
                console.log('Schritte aus Datenbank ********************************: ' + data.data);
                backwardStep = data.data;
                maxRecords = data.data;
                if(backwardStep === 0){
                    $('.btnUndo').addClass('disabled');
                    console.log(backwardStep);
                }
                else{
                    $('.btnUndo').removeClass('disabled');
                    console.log(backwardStep);
                }
            }

        });
    }

    getHistoryRecords();


    $('.btnUndo').on('click',function(e){
        e.preventDefault();

        $('.btnRedo').removeClass('disabled');


        if (backwardStep == 0) {
            $('.btnUndo').addClass('disabled');
        }
        else{
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "../index.php?option=com_ajax&plugin=Whykikipagebuilder&method=getHistory&format=json",
                data: { currentID: currentID, backwardStep: backwardStep},
                success: function(historyData) {
                    backwardStep = backwardStep - 1;
                    console.log('backward: ' + backwardStep);
                    if (backwardStep == 0) {
                        $('.btnUndo').addClass('disabled');
                    }
                    else{
                        $('.btnUndo').removeClass('disabled');
                    }
                    $('#content-area').keditor();
                    $('#content-area').keditor('setContent','');
                    //console.log('hsitoryData: ' + historyData.data);
                    $('#content-area').keditor('setContent',historyData.data);
                }
            });
            $('.btnUndo').removeClass('disabled');
        }

    });

    $('.btnRedo').on('click',function(e){
        e.preventDefault();

        if (backwardStep > maxRecords) {
            $('.btnRedo').addClass('disabled');
            console.log('backward: ' + backwardStep);
        }
        else{
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "../index.php?option=com_ajax&plugin=Whykikipagebuilder&method=getHistory&format=json",
                data: { currentID: currentID, backwardStep: backwardStep + 1},
                success: function(historyData) {
                    backwardStep = backwardStep + 1;
                    console.log('backward: ' + backwardStep);
                    $('#content-area').keditor();
                    $('#content-area').keditor('setContent','');
                    console.log('hsitoryData: ' + historyData.data);
                    $('#content-area').keditor('setContent',historyData.data);
                }
            });
        }


    });

    /*****************************************************************************************************************/
    // Save Layout
    /*****************************************************************************************************************/

    $('.saveLayout').on('click', function (e) {

        e.preventDefault();

        //e.stopPropagation();

        var editorContent = $('#content-area').keditor('getContent');

        //console.log('edCont:' + editorContent);

        var withoutSection = $('#content-area').keditor('getContentWithoutSection').replace('data-type="container-content"','');


        $('#jform_whykikipagebuilder').val(editorContent);

        $('#jform_withoutsections').val(withoutSection);
        $('#cleaned').html(withoutSection);
        $('#codepreview').html(editorContent);
        $('#debugcode').val(withoutSection);
        // Override Joomla standard save button

        $('.button-apply').trigger('click');
    });

    /*****************************************************************************************************************/
    // Close
    /*****************************************************************************************************************/

    $('.closeLayout').on('click', function (e) {
        e.preventDefault();
        $('.buttonClose').trigger('click');
    });

    /*****************************************************************************************************************/
    // Reset layout
    /*****************************************************************************************************************/

    $('.resetLayout').on('click', function (e) {
        e.preventDefault();
        $('#content-area').keditor('setContent', '');
    });

    /*****************************************************************************************************************/
    // Trigger contentchange for initial load
    /*****************************************************************************************************************/


    $(document).trigger('contentchange');
});



