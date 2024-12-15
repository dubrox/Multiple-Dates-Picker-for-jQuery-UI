const jQuery = require('jquery');
global.$ = global.jQuery = window.$ = window.jQuery = jQuery;
jQuery.ui = require('jquery-ui');
require('jquery-ui/ui/widgets/datepicker');
require('./jquery-ui.multidatespicker.js');
