<?php
/**
 * @package     Joomla.Cms
 * @subpackage  Layout
 *
 * @copyright   Copyright (C) 2005 - 2015 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('JPATH_BASE') or die;

$form = $displayData->getForm();

$title = $form->getField('title') ? 'title' : ($form->getField('name') ? 'name' : '');

?>
<div class="form-inline form-inline-header">
	<?php
	echo $title ? $form->renderField($title) : '';
	echo $form->renderField('alias');
	$itemID = $displayData->get('Item')->id;
	?>

</div>
<div class="form-inline form-inline-header">
	<?php
    echo '<a href="index.php?option=com_content&view=article&layout=edit&pagebuilder=1&id='.$itemID.'" class="btn btn-primary pagebuilderOpen" style="height: 40px; width: 200px; line-height: 40px; font-size: 20px;"><span class="icon-eye"></span>  ' . JText::_('PLG_SYSTEM_KICKPB_OPENPAGEBUILDER'). '</a>';
	echo $form->renderField('whykikipagebuilder');
	echo $form->renderField('withoutsections');
	?>

</div>