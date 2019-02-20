<?php
/**
 * Joomla! Content plugin - plgSystemKickPB
 *
 * @author     Niels Nuebel <niels@niels-nuebel.de>
 * @copyright  Copyright 2015-2016 Niels Nuebel. All rights reserved
 * @license    GNU Public License
 * @link       http://www.niels-nuebel.de
 */
// No direct access
defined('_JEXEC') or die('Restricted access');
/**
 * plgSystemKickPB Content Plugin
 */
class plgSystemWhykikipagebuilder extends JPlugin
{
	protected $app;
	protected $language;



	public function __construct(& $subject, $config)
	{
		parent::__construct($subject, $config);
		$this->loadLanguage();

	}

	/**
	 * Event method that runs on content preparation
	 *
	 * @param   JForm   $form The form object
	 * @param   integer $data The form data
	 *
	 * @return bool
	 */
	public function onContentPrepareForm($form, $data)
	{
		//echo phpinfo();
		$overridePath                   = JPATH_PLUGINS . '/system/whykikipagebuilder/layouts';
		JLayoutHelper::$defaultBasePath = $overridePath;

		$this->_setPagebuilderParameters();
		$input = $this->app->input;

		//var_dump($input->get('id'));
		$document = JFactory::getDocument();
		$document->addScriptOptions('currentID', $input->get('id'));

		if (!$this->app->input->get('pagebuilder', false, 'INT'))
		{
			return;
		}

		if ($form->getName() == 'com_content.article')
		{
			JForm::addFieldPath(JPATH_PLUGINS . '/system/whykikipagebuilder/fields');
			JForm::addFormPath(__DIR__ . '/forms');
			$form->loadFile('article', true);
		}
	}


	protected function _setPagebuilderParameters(){

		$document = JFactory::getDocument();
		$params = $this->params;
		$tester = $params->get('audio_folder');
		$language = [
			'photoSettings' =>	JText::_('PLG_SYSTEM_WHYPB_PHOTOSETTINGS'),
			'videoSettings' => JText::_('PLG_SYSTEM_WHYPB_VIDEOSETTINGS'),
			'downloadSettings' =>	JText::_('PLG_SYSTEM_WHYPB_DOWNLOADSETTINGS'),
			'downloadSetDownload' =>	JText::_('PLG_SYSTEM_WHYPB_SETDOWNLOAD'),
			'downloadTxtDownload' => JText::_('PLG_SYSTEM_WHYPB_TXTDOWNLOAD'),
			'buttonTxtSettings' => JText::_('PLG_SYSTEM_WHYPB_BUTTONSETTINGS'),
			'buttonSetButton' => JText::_('PLG_SYSTEM_WHYPB_SETBUTTON'),
			'close' => JText::_('PLG_SYSTEM_WHYPB_CLOSE'),
			'audioSettings' =>	JText::_('PLG_SYSTEM_WHYPB_AUDIOSETTINGS'),
			'changePhoto' => JText::_('PLG_SYSTEM_WHYPB_CHANGE_PHOTO'),
			'changeAudio' => JText::_('PLG_SYSTEM_WHYPB_CHANGE_AUDIO'),
			'controls' => JText::_('PLG_SYSTEM_WHYPB_CONTROLS'),
			'autoplay' => JText::_('PLG_SYSTEM_WHYPB_AUTOPLAY'),
			'width' =>	JText::_('PLG_SYSTEM_WHYPB_WIDTH'),
			'height' => JText::_('PLG_SYSTEM_WHYPB_HEIGHT'),
			'audioFile' => JText::_('PLG_SYSTEM_WHYPB_AUDIO_FILE'),
		];

		$document->addScriptOptions('pagebuilderParams', $language);


	}

	public function onContentBeforeSave($context, $item, $isNew)
	{
		if ($context != 'com_content.article')
		{
			return;
		}

		$form = $this->app->input->get('jform', false, 'ARRAY');

		if (!is_null($form['withoutsections']) && isset($form['withoutsections']))
		{
			$item->fulltext = $form['withoutsections'];
		}
	}

	/**
	 * After initialise.
	 *
	 * @return  void
	 *
	 * @since      1.6
	 * @deprecate  4.0  Obsolete
	 */
	public function onAfterDispatch()
	{
		if ($this->app->input->get('pagebuilder', false, 'INT'))
		{
			$this->app->input->set('tmpl', 'component');
		}
	}

	public function onContentPrepareData($context, &$data)
	{
		if ($context != 'com_content.article') {
			return;
		}

		if (empty($data->id))
		{
			return $data;
		}

		$db = JFactory::getDbo();
		$query = $db->getQuery(true);
		$query->select('a.sections as whykikipagebuilder, a.withoutsections')
			->from($db->quoteName('#__whykikipagebuilder') . ' AS a')
			->where($db->quoteName('a.content_id') . '=' . $data->id)
			->where($db->quoteName('a.context') . '=' . $db->quote($context));

		$db->setQuery($query);
		$cckdata = $db->loadAssoc();

		if(!is_null($cckdata['whykikipagebuilder']))
		{
			$data->whykikipagebuilder = $cckdata['whykikipagebuilder'];
			$data->withoutsections = $cckdata['withoutsections'];
		}
	}

	/**
	 * Event method that is run after an item is saved
	 *
	 * @param   string   $context  The context of the content
	 * @param   object   $item     A JTableContent object
	 * @param   boolean  $isNew    If the content is just about to be created
	 *
	 * @return	boolean  Return value
	 */

	/*****************************************************************************************************************/
	// After save
	// --> write CCK to database
	/*****************************************************************************************************************/


	public function onContentAfterSave($context, $item, $isNew)
	{
		if ($context != 'com_content.article')
		{
			return;
		}


		// Write additional article infos

		$form = $this->app->input->get('jform', false, 'ARRAY');

		$content_id = $item->id;
		$db         = JFactory::getDbo();
		$query      = $db->getQuery(true);
		$query->select($db->quoteName('content_id'))
			->from($db->quoteName('#__whykikipagebuilder'))
			->where($db->quoteName('content_id') . '=' . $content_id)
			->where($db->quoteName('context') . '=' . $db->quote($context));
		$db->setQuery($query);
		$db->execute();
		$exists = (bool) $db->getNumRows();
		$data   = new \stdClass;

		$data->content_id = $content_id;
		$data->context    = $context;
		$data->sections   = $form['whykikipagebuilder'];
		$data->withoutsections   = $form['withoutsections'];
		$data->history = '';

		if ($exists)
		{
			$result = $db->updateObject('#__whykikipagebuilder', $data, 'content_id');
		}
		else
		{
			$result = $db->insertObject('#__whykikipagebuilder', $data);
		}
		$this->app->input->set('pagebuilder',1);
		return $result;
	}

	/*****************************************************************************************************************/
	// Set CCK vars for use in frontend overrides
	/*****************************************************************************************************************/

	/**
	 * Event method run before content is displayed
	 *
	 * @param   string  $context  The context for the content passed to the plugin.
	 * @param   object  &$item    The content to be displayed
	 * @param   mixed   &$params  The article params
	 * @param   int     $page     Current page
	 *
	 * @return	null
	 */


	public function onContentBeforeDisplay($context, &$item, &$params, $page = 0)
	{
		$doc = JFactory::getDocument();
		//unset($doc->_scripts[JURI::root(true) . '/media/jui/js/jquery.min.js']);
		//unset($doc->_scripts[JURI::root(true) . '/media/jui/js/jquery-noconflict.js']);
		//unset($doc->_scripts[JURI::root(true) . '/media/jui/js/jquery-migrate.min.js']);

		if (empty($item->id))
		{
			return $item;
		}

		$db = JFactory::getDbo();
		$query = $db->getQuery(true);
		$query->select('a.sections as whykikipagebuilder, a.withoutsections')
			->from($db->quoteName('#__whykikipagebuilder') . ' AS a')
			->where($db->quoteName('a.content_id') . '=' . $item->id)
			->where($db->quoteName('a.context') . '=' . $db->quote($context));

		$db->setQuery($query);
		$cckdata = $db->loadAssoc();

		if(!is_null($cckdata['whykikipagebuilder']))
		{
			$item->whykikipagebuilder = $cckdata['whykikipagebuilder'];
			$item->withoutsections = $cckdata['withoutsections'];
		}
	}


	/*****************************************************************************************************************/
	// Unload admin template js
	/*****************************************************************************************************************/

	public function onBeforeCompileHead()
	{
		$doc = JFactory::getDocument();

		if ($this->app->input->get('pagebuilder', false, 'INT'))
		{
			unset($doc->_scripts[JURI::root(true) . '/administrator/templates/isis/js/template.js']);
			unset($doc->_scripts[JURI::root(true) . '/media/jui/js/bootstrap.min.js']);
			unset($doc->_scripts[JURI::root(true) . '/media/jui/js/bootstrap-tooltip-extended.min.js']);
			unset($doc->_scripts[JURI::root(true) . '/media/jui/css/bootstrap-tooltip-extended.css']);
			unset($doc->_scripts[JURI::root(true) . '/media/system/js/mootools-core.js']);
			unset($doc->_scripts[JURI::root(true) . '/media/system/js/mootools-more.js']);

		}

		$doc->addStyleSheet('../plugins/system/whykikipagebuilder/assets/plugins/lightbox/css/lightbox.css');
		$doc->addScript('../plugins/system/whykikipagebuilder/assets/plugins/lightbox/js/lightbox.js');
	}



	/*****************************************************************************************************************/
	// Get template name
	// -> loading frontend css
	/*****************************************************************************************************************/

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


	/*****************************************************************************************************************/
	/*****************************************************************************************************************/
	/*****************************************************************************************************************/
	// Ajax Funktionen
	/*****************************************************************************************************************/
	/*****************************************************************************************************************/
	/*****************************************************************************************************************/


	public function onAjaxWhykikipagebuilder()
	{
		$input = $this->app->input;
		$method = $input->get('method', 'audioUpload');

		switch ($method) {
			case 'audioUpload':
				$results = $this->_audioUpload();
				break;
			case 'imageUpload':
				$results = $this->_imageUpload();
				break;
			case 'videoUpload':
				$results = $this->_videoUpload();
				break;
			case 'writeHistory':
				$results = $this->_writeHistory();
				break;
			case 'getHistory':
				$results = $this->_getHistory();
				break;
			case 'getHistoryStep':
				$results = $this->_getHistoryStep();
				break;
			default:
				$results = $this->_default();
		}

		echo new JResponseJson($results, null, false, $input->get('ignoreMessages', true, 'bool'));
		$this->app->close();
	}

	/*****************************************************************************************************************/
	// Audio upload
	/*****************************************************************************************************************/

	protected function _audioUpload()
	{
		$input = $this->app->input;
		//$blob = $input->get('file','','RAW');
		$dataPost = $input->get('data','','RAW');
		$filenamePost = $input->get('filename','','RAW');

		$search = array("Ä", "Ö", "Ü", "ä", "ö", "ü", "ß", "´"," ",'"');
		$replace = array("Ae", "Oe", "Ue", "ae", "oe", "ue", "ss", "","","");

		$filenamePost = str_replace($search,$replace,$filenamePost);

		//var_dump($filenamePost);die;
		// pull the raw binary data from the POST array
		$data = substr($dataPost, strpos($dataPost, ",") + 1);
		// decode it
		$decodedData = base64_decode($data);

		if (!file_exists($_SERVER['DOCROOT']."/images/audio/")) {
			mkdir($_SERVER['DOCROOT']."/images/audio/", 0777, true);
		}

		$filename = $_SERVER['DOCROOT']."/images/audio/".$filenamePost;

		$filenameReturn = '/images/audio/'.$filenamePost;

		// write the data out to the file
		$fp = fopen($filename, 'wb');
		fwrite($fp, $decodedData);
		fclose($fp);
		//var_dump($filename);die;
		return $filenameReturn;
	}

	/*****************************************************************************************************************/
	// Video upload
	/*****************************************************************************************************************/

	protected function _videoUpload()
	{
		$input = $this->app->input;
		//$blob = $input->get('file','','RAW');
		$dataPost = $input->get('data','','RAW');
		$filenamePost = $input->get('filename','','RAW');
		//var_dump($filenamePost);die;
		$search = array("Ä", "Ö", "Ü", "ä", "ö", "ü", "ß", "´"," ",'"');
		$replace = array("Ae", "Oe", "Ue", "ae", "oe", "ue", "ss", "","","");

		$filenamePost = str_replace($search,$replace,$filenamePost);

		// pull the raw binary data from the POST array
		$data = substr($dataPost, strpos($dataPost, ",") + 1);
		// decode it
		$decodedData = base64_decode($data);
		// print out the raw data,
		//echo ($decodedData);

		if (!file_exists($_SERVER['DOCROOT']."/images/video/")) {
			mkdir($_SERVER['DOCROOT']."/images/video/", 0777, true);
		}

		$filename = $_SERVER['DOCROOT']."/images/video/".$filenamePost;

		$filenameReturn = '/images/video/'.$filenamePost;

		// write the data out to the file
		$fp = fopen($filename, 'wb');
		fwrite($fp, $decodedData);
		fclose($fp);

		return $filenameReturn;
	}

	/*****************************************************************************************************************/
	// Get template name
	// -> loading frontend css
	/*****************************************************************************************************************/

	protected function _imageUpload()
	{
		return 'Bilder Hochladen';
	}

	/*****************************************************************************************************************/
	// Write History
	/*****************************************************************************************************************/

	protected function _getOldHistoryWrite(){
		$input = $this->app->input;
		$currentID =  $input->get('currentID', '','INT');
		$db         = JFactory::getDbo();
		$queryHistory      = $db->getQuery(true);
		$queryHistory->select($db->quoteName('history'))
			->from($db->quoteName('#__whykikipagebuilder'))
			->where($db->quoteName('content_id') . '=' . $currentID);
		$db->setQuery($queryHistory);
		$oldHistory = $db->loadResult();
		return $oldHistory;
	}
	protected function _writeHistory()
	{
		$input = $this->app->input;
		$history = $input->get('history', '','RAW');
		$currentID =  $input->get('currentID', '','INT');

		$db         = JFactory::getDbo();
		$query      = $db->getQuery(true);
		$query->select($db->quoteName('content_id'))
			->from($db->quoteName('#__whykikipagebuilder'))
			->where($db->quoteName('content_id') . '=' . $currentID);
		$db->setQuery($query);
		$db->execute();

		$exists = (bool) $db->getNumRows();

		// Get History from database
		$oldHistory = $this->_getOldHistoryWrite();
		$oldHistory = json_decode($oldHistory,true);
		$historyStep = count($oldHistory);

		//var_dump(json_decode($oldHistory, true));die;
		if(!empty($oldHistory)){
			$counter = $historyStep + 1;
			$newHistory = $oldHistory;
			$newHistory[$counter] = $history;
			$newHistory = json_encode($newHistory);
		}
		else if($historyStep = 1){
			$newHistory = $oldHistory;
			$newHistory[1] = $history;
			$newHistory = json_encode($newHistory);
		}
		else{
			$newHistory[0] = $history;
			$newHistory = json_encode($newHistory);
		}

		//var_dump(json_decode($newHistory, true));
		$data   = new \stdClass;
		$data->content_id = $currentID;
		$data->history = $newHistory;

		if ($exists)
		{
			 $result = $db->updateObject('#__whykikipagebuilder', $data, 'content_id');
		}
		else
		{
			$result = $db->insertObject('#__whykikipagebuilder', $data);
		}

		return $result;
	}

	/*****************************************************************************************************************/
	// Get History
	/*****************************************************************************************************************/

	protected function _getHistoryStep(){
		$input = $this->app->input;
		$currentID =  $input->get('currentID', '','INT');
		$db         = JFactory::getDbo();
		$queryHistory      = $db->getQuery(true);
		$queryHistory->select($db->quoteName('history'))
			->from($db->quoteName('#__whykikipagebuilder'))
			->where($db->quoteName('content_id') . '=' . $currentID);
		$db->setQuery($queryHistory);
		$oldHistory = $db->loadResult();
		$oldHistory = json_decode($oldHistory,true);

		//var_dump($oldHistory);die;

		if(!empty($oldHistory)){
			return $historyCounter = count($oldHistory);
		}
		else{
			return $historyCounter = 0;
		}
	}

	protected function _getHistory(){
		$input = $this->app->input;
		$currentID =  $input->get('currentID', '','INT');
		$step =  $input->get('backwardStep', '','INT');
		$db         = JFactory::getDbo();
		$queryHistory      = $db->getQuery(true);
		$queryHistory->select($db->quoteName('history'))
			->from($db->quoteName('#__whykikipagebuilder'))
			->where($db->quoteName('content_id') . '=' . $currentID);
		$db->setQuery($queryHistory);
		$oldHistory = $db->loadResult();
		$history = json_decode($oldHistory,true);

		return $history[$step];
	}

	/*****************************************************************************************************************/
	// Ajax Fallback
	/*****************************************************************************************************************/

	protected function _default()
	{
		return 'Method fehlt';

	}

}