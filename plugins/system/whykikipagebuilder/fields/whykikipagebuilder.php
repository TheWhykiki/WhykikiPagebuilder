<?php
/**
 * @package     Joomla.Platform
 * @subpackage  Form
 *
 * @copyright   Copyright (C) 2005 - 2015 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_PLATFORM') or die;

/**
 * Form Field class for the Joomla Platform.
 * Display a JSON loaded window with a repeatable set of sub fields
 *
 * @since  3.2
 */
class JFormFieldWhykikipagebuilder extends JFormField
{
	/**
	 * The form field type.
	 *
	 * @var    string
	 * @since  3.2
	 */
	protected $type = 'Whykikipagebuilder';

	/**
	 * Name of the layout being used to render the field
	 *
	 * @var    string
	 * @since  3.7
	 */
	protected $layout = 'joomla.form.field.hidden';

	/**
	 * Method to get the field input markup.
	 *
	 * @return  string  The field input markup.
	 *
	 * @since   3.2
	 */
	protected function getInput()
	{
		$this->_loadFiles();
		$formdata = $this->getLayoutData();

		//print_r($formdata['value']);
		$str[] ='		<div class="card cardPagebuilder">';
		$str[] ='        <div class="card-body">';
		$str[] ='            <h2 class="editorHeadline">Schritt 1: Pagebuilder Optionen</h2>';
		$str[] ='            <div class="btn-wrapper" id="toolbar-apply">';
		$str[] ='                <button class="saveLayout btn-primary btn btn-success">';
		$str[] ='                    <i class="fa fa-save" aria-hidden="true"></i>';
		$str[] ='						Speichern</button>';
		$str[] ='                <button class="closeLayout btn btn-small btn-primary btn btn-small button-cancel">';
		$str[] ='                    <i class="fa fa-save" aria-hidden="true"></i>';
		$str[] ='						Schliessen</button>';
		$str[] ='                <button class="knopp  resetLayout btn btn-small btn-danger">';
		$str[] ='                    <i class="fa fa-times-circle"></i>Layout zurücksetzen</button>';
		$str[] ='            </div>';
		$str[] ='            <div class="btn-wrapper" id="toolbar-apply">';
		$str[] ='      				 <button class="btn btnTools btnUndo">';
		$str[] ='		                <i class="fas fa-undo"></i> Rückgängig';
		$str[] ='					</button>';
		$str[] ='      				 <button class="btn btnTools btnRedo disabled">';
		$str[] ='		                <i class="fas fa-redo"></i> Wiederherstellen';
		$str[] ='					</button>';
		$str[] ='            </div>';
		$str[] ='        </div>';
		$str[] ='    </div>';
		//$str[] ='    <h2>Gecleante Ausgabe</h2><textarea id="cleaned" style="display: block;" cols="100" rows="10"></textarea>';


		$str[] ='        <div id="test" style="color:white;">koko</div>';
		$str[] ='    <div data-keditor="html">';
		//var_dump($formdata['value']);
		$str[] ='        <div id="content-area">' . $formdata['value'] . '</div>';
		$str[] ='    </div>';



		$str[] ='	<div id="accordionSettings">';
		$str[] =' 		<div class="card cardSettings">';
		$str[] ='   		<div class="card-header" id="headingCodeEditor">';
		$str[] ='     			<h5 class="mb-0">';
		$str[] ='      				 <button class="btn btnCollapse" data-toggle="collapse" data-target="#collapseCodeEditor" aria-expanded="true" aria-controls="collapseCodeEditor">';
		$str[] ='		                 <i class=" fa fas fa-laptop-code"></i> Code Editor';
		$str[] ='					</button>';
		$str[] ='     			</h5>';
		$str[] ='   		</div>';

		$str[] ='  			 <div id="collapseCodeEditor" class="collapse show" aria-labelledby="headingCodeEditor" data-parent="#accordionSettings">';
		$str[] ='    			 <div class="card-body">';
		$str[] ='    <h2>Codepreview</h2><textarea id="codepreview" data-editor="html" style="display: block;" cols="10" rows="100"></textarea>';
		$str[] ='     			</div>';
		$str[] ='   		</div>';
		$str[] =' 		</div>';
		$str[] =' 		<div class="card cardSettings">';
		$str[] ='   		<div class="card-header" id="headingDebugBar">';
		$str[] ='    	 		<h5 class="mb-0">';
		$str[] ='       			<button class="btn btnCollapse" data-toggle="collapse" data-target="#collapseDebugBar" aria-expanded="false" aria-controls="collapseDebugBar">';
		$str[] ='                       <i class="fas fa-project-diagram"></i> Debug Bar';
		$str[] ='       			</button>';
		$str[] ='     			</h5>';
		$str[] ='   		</div>';
		$str[] ='   		<div id="collapseDebugBar" class="collapse" aria-labelledby="headingDebugBar" data-parent="#accordionSettings">';
		$str[] ='     			<div class="card-body">';
		$str[] ='    <h2>Debug Code</h2><textarea id="debugcode" data-editor="html" style="display: block;" cols="10" rows="100"></textarea>';
		$str[] ='   			</div>';
		$str[] ='   		</div>';
		$str[] =' 		</div>';
		/*
		$str[] =' 		<div class="card cardSettings">';
		$str[] ='   		<div class="card-header" id="headingThree">';
		$str[] ='     			<h5 class="mb-0">';
		$str[] ='       			<button class="btn btnCollapse" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">';
		$str[] ='		                Collapsible Group Item #3';
		$str[] ='					</button>';
		$str[] ='     			</h5>';
		$str[] ='   		</div>';
		$str[] ='   		<div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionSettings">';
		$str[] ='     			<div class="card-body">';
		$str[] ='	                Kakak3 ';
		$str[] ='     			</div>';
		$str[] ='   		</div>';
		$str[] =' 		</div>';
		*/
		$str[] ='</div>';
		
		
		$str[] ='    <div class="card cardJoomla">';
		$str[] ='        <div class="card-body">';
		$str[] ='            <h2 class="editorHeadline">Schritt 2: Joomla Beitrag speichern / schliessen</h2>';
		$str[] ='            <div class="btn-wrapper" id="toolbar-cancel">';
		$str[] ='               <button onclick="Joomla.submitbutton(\'article.save\');" class="btn btn-small button-apply btn-success">';
		$str[] ='                   <i class="fa fa-edit"></i>';
		$str[] ='	Speichern</button>';
		$str[] ='               <button onclick="Joomla.submitbutton(\'article.cancel\');" class="btn btn-small button-cancel buttonClose">';
		$str[] ='                   <i class="fa fa-times-circle"></i>';
		$str[] ='	Schließen</button>';
		$str[] ='            </div>';
		$str[] ='        </div>';
		$str[] ='    </div>';

		$str[] = rtrim($this->getRenderer($this->layout)->render($formdata), PHP_EOL);

		return implode("\n", $str);
	}


	protected function _loadFiles(){
		$doc = JFactory::getDocument();
		unset($doc->_scripts[JURI::root(true) . '/administrator/templates/isis/js/template.js']);
		/*
				unset($doc->_scripts[JURI::root(true) . '/media/jui/js/jquery.min.js']);
				unset($doc->_scripts[JURI::root(true) . '/media/jui/js/jquery-noconflict.js']);
				unset($doc->_scripts[JURI::root(true) . '/media/jui/js/bootstrap.min.js']);
				unset($doc->_scripts[JURI::root(true) . '/media/jui/js/bootstrap-tooltip-extended.min.js']);

		unset($doc->_scripts[JURI::root(true) . '/media/system/js/core.js']);
		unset($doc->_scripts[JURI::root(true) . '/media/system/js/punycode.js']);
		unset($doc->_scripts[JURI::root(true) . '/media/system/js/validate.js']);
		unset($doc->_scripts[JURI::root(true) . '/media/system/js/keepalive.js']);
		//unset($doc->_scripts[JURI::root(true) . '/media/jui/js/chosen.jquery.min.js']);
		unset($doc->_scripts[JURI::root(true) . '/media/editors/tinymce/tinymce.min.js']);
		unset($doc->_scripts[JURI::root(true) . '/media/editors/tinymce/js/tinymce.min.js']);
		unset($doc->_scripts[JURI::root(true) . '/administrator/templates/isis/js/template.js']);
		unset($doc->_scripts[JURI::root(true) . '/media/com_content/js/admin-article-readmore.min.js']);
		unset($doc->_scripts[JURI::root(true) . '/media/editors/tinymce/js/tiny-close.min.js']);
		unset($doc->_scripts[JURI::root(true) . '/media/jui/js/chosen.jquery.min.js']);
		unset($doc->_scripts[JURI::root(true) . '/media/jui/js/ajax-chosen.min.js']);

		unset($doc->_scripts[JURI::root(true) . '/media/jui/js/jquery-migrate.min.js']);
		unset($doc->_scripts[JURI::root(true) . '/media/system/js/tabs-state.js']);
		unset($doc->_scripts[JURI::root(true) . '/media/plg_system_stats/js/stats.js']);
		unset($doc->_scripts[JURI::root(true) . '/media/system/js/polyfill.xpath.js']);
*/
		$templatePath = $this->_getTemplateData();

		$doc->addStyleSheet('/plugins/system/whykikipagebuilder/assets/css/examples.css');
		$doc->addStyleSheet('/plugins/system/whykikipagebuilder/assets/plugins/bootstrap4/css/bootstrap.min.css');
		$doc->addStyleSheet('/templates/'.$templatePath.'/css/template.css');
		$doc->addStyleSheet('http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.css');
		$doc->addStyleSheet('/plugins/system/whykikipagebuilder/assets/css/keditor.css');
		$doc->addStyleSheet('/plugins/system/whykikipagebuilder/assets/css/keditor-components.css');
		$doc->addStyleSheet('/plugins/system/whykikipagebuilder/assets/plugins/fontawesome5/css/all.css');
		$doc->addStyleSheet('/plugins/system/whykikipagebuilder/code-prettify/src/prettify.css');
		$doc->addStyleSheet('/plugins/system/whykikipagebuilder/assets/plugins/ace/theme-twilight.css');
		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/jquery-1.11.3/jquery-1.11.3.min.js');
		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/jquery-ui-1.12.1.custom/jquery-ui.min.js');
		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/fontawesome5/fontawesome.js');
		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/bootstrap4/js/popper.min.js');
		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/bootstrap4/js/bootstrap.min.js');
		//$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/jquery.nicescroll-3.6.6/jquery.nicescroll.min.js');
		//$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/ckeditor-4.5.6/ckeditor.js');
		//$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/ckeditor-4.5.6/adapters/jquery.js');

		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/ckeditor/ckeditor.js');
		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/ckeditor/adapters/jquery.js');

		$doc->addScript('http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.js');
		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/keditor.js');

		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/keditor-components.js');
		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/code-prettify/src/prettify.js');
		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/js-beautify-1.7.5/js/lib/beautify.js');
		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/js-beautify-1.7.5/js/lib/beautify-html.js');
		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/ace/ace.js', 'module');
		$doc->addScript('/plugins/system/whykikipagebuilder/assets/plugins/custom.js');


	}

	protected function _getTemplateData(){
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);
		$query->select('template');
		$query->from($db->quoteName('#__template_styles'));
		$query->where($db->quoteName('client_id')." = 0");
		$query->andWhere($db->quoteName('home')." = 1");

		// Reset the query using our newly populated query object.
		$db->setQuery($query);
		$templateName = $db->loadResult();
		return $templateName;
	}

	/**
	 * Method to get the data to be passed to the layout for rendering.
	 *
	 * @return  array
	 *
	 * @since 3.7
	 */
	protected function getLayoutData()
	{
		return parent::getLayoutData();
	}
}