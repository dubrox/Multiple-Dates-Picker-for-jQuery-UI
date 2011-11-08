/*
 * MultiDatesPicker v1.5.2
 * http://multidatespickr.sourceforge.net/
 * 
 * Copyright 2011, Luca Lauretta
 * Dual licensed under the MIT or GPL version 2 licenses.
 */
(function( $ ){
	$.extend($.ui, { multiDatesPicker: { version: "1.5.2" } });
	
	$.fn.multiDatesPicker = function(method) {
		var mdp_arguments = arguments;
		var ret = this;
		var today_date = new Date();
		var day_zero = new Date(0);
		var mdp_events = {};
		
		function removeDate(index, type) {
			if(!type) type = 'picked';
			this.multiDatesPicker.dates[type].splice(index, 1);
		}
		function addDate(date, type, no_sort) {
			if(!type) type = 'picked';
			if (methods.gotDate.call(this, date, type) === false) {
				this.multiDatesPicker.dates[type].push(dateConvert.call(this, date));
				if(!no_sort) this.multiDatesPicker.dates[type].sort(methods.compareDates);
			} 
		}
		function sortDates(type) {
			if(!type) type = 'picked';
			this.multiDatesPicker.dates[type].sort(methods.compareDates);
		}
		function dateConvert(date, desired_type, date_format) {
			if(!desired_type) desired_type = 'object';
			if(!date_format && (typeof date == 'string')) {
				date_format = $(this).datepicker('option', 'dateFormat');
				if(!date_format) date_format = $.datepicker._defaults.dateFormat;
			}
			
			return methods.dateConvert.call(this, date, desired_type, date_format);
		}
		
		var methods = {
			init : function( options ) {
				var $this = $(this);
				this.multiDatesPicker.changed = false;
				
				var mdp_events = {
					beforeShow: function(input, inst) {
						this.multiDatesPicker.changed = false;
						if(this.multiDatesPicker.originalBeforeShow) this.multiDatesPicker.originalBeforeShow.call(this, input, inst);
					},
					onSelect : function(dateText, inst) {
						var $this = $(this);
						this.multiDatesPicker.changed = true;
						
						if (dateText) {
							$this.multiDatesPicker('toggleDate', dateText);
							var current_date = dateConvert.call(this, dateText);
						}
						var dates_picked = $this.multiDatesPicker('getDates');
						var datos = this.multiDatesPicker.mode.options;
						
						if (dates_picked.length > 0) {
							if (this.multiDatesPicker.mode.modeName == 'normal') {
								if (datos.pickableRange) {
									var min_date = methods.compareDates(dateConvert.call(this, this.multiDatesPicker.minDate, 'object'), today_date);
									var max_date = min_date + datos.pickableRangeDelay + pickableRange;
									
									// min
									var n_min_date = methods.compareDates(dateConvert.call(this, dates_picked[0], 'object'), dateConvert.call(this, min_date, 'object'));
									
									// max
									var n_max_date = n_min_date + datos.pickableRange;
									
									// adjust
									if (n_max_date > max_date) min_date = max_date - datos.pickableRange + 1;
									else {
										max_date = n_max_date;
										min_date = n_min_date;
									}
										
									// counts the number of disabled dates in the range
									var c_disabled;
									do {
										c_disabled = 0;
										for(var i in this.multiDatesPicker.dates.disabled) {
											var avdatei = dateConvert.call(this, this.multiDatesPicker.dates.disabled[i], 'object');
											if(methods.compareDates(avdatei, min_date) >= 0 &&
													methods.compareDates(avdatei, max_date) <= 0)
												c_disabled++;
										}
										max_date = max_date + c_disabled;
									} while(c_disabled != 0);
									
									$this.datepicker("option", "minDate", min_date);
									$this.datepicker("option", "maxDate", max_date);
								}
							}
						}
						
						if(this.tagName == 'INPUT') { // for inputs
							$this.val(
								$this.multiDatesPicker('getDates', 'string')
							);
						}
						
						if(this.multiDatesPicker.originalOnSelect && dateText)
							this.multiDatesPicker.originalOnSelect.call(this, dateText, inst);
						
						// thanks to bibendus83 -> http://sourceforge.net/tracker/?func=detail&atid=1495384&aid=3403159&group_id=358205
						if ($this.datepicker('option', 'altField') != undefined && $this.datepicker('option', 'altField') != "") {
							$($this.datepicker('option', 'altField')).val(
								$this.multiDatesPicker('getDates', 'string')
							);
						}
					},
					beforeShowDay : function(date) {
						var $this = $(this);
						var gotThisDate = $this.multiDatesPicker('gotDate', date) !== false;
						var highlight_class = gotThisDate
							? 'ui-state-highlight'
							: '';
							
						var isDisabledDate = $this.multiDatesPicker('gotDate', date, 'disabled') !== false;
						var allSelected = this.multiDatesPicker.mode.options.maxPicks == $this.multiDatesPicker('getDates').length;
						var selectable_date = (isDisabledDate || (allSelected && !highlight_class))
							? false
							: true;
							
						if(this.multiDatesPicker.originalBeforeShowDay) this.multiDatesPicker.originalBeforeShowDay.call(this, date);
						
						return [selectable_date, highlight_class];
					},
					onClose: function(dateText, inst) {
						if(this.tagName == 'INPUT' && this.multiDatesPicker.changed) {
							$(inst.dpDiv[0]).stop(false,true);
							setTimeout('$("#'+inst.id+'").datepicker("show")',50);
						}
						if(this.multiDatesPicker.originalOnClose) this.multiDatesPicker.originalOnClose.call(this, dateText, inst);
					}
				};
				
				if(options) {
					this.multiDatesPicker.originalBeforeShow = options.beforeShow;
					this.multiDatesPicker.originalOnSelect = options.onSelect;
					this.multiDatesPicker.originalBeforeShowDay = options.beforeShowDay;
					this.multiDatesPicker.originalOnClose = options.onClose;
					
					$this.datepicker(options);
					
					this.multiDatesPicker.minDate = $.datepicker._determineDate(this, options.minDate, day_zero);
					this.multiDatesPicker.firstAvailableDay = methods.compareDates(this.multiDatesPicker.minDate, day_zero);
					
					if(options.addDates) methods.addDates.call(this, options.addDates);
					if(options.addDisabledDates)
						methods.addDates.call(this, options.addDisabledDates, 'disabled');
					
					if(options.mode)
						methods.setMode.call(this, options.mode);
				} else {
					$this.datepicker();
				}
				
				$this.datepicker('option', mdp_events);
				
				if(this.tagName == 'INPUT') $this.val($this.multiDatesPicker('getDates', 'string'));
				
				// Fixes the altField filled with defaultDate by default
				var altFieldOption = $this.datepicker('option', 'altField');
				if (altFieldOption) $(altFieldOption).val($this.multiDatesPicker('getDates', 'string'));
			},
			compareDates : function(date1, date2) {
				var one_day = 1000*60*60*24;
				// return > 0 means date1 is later than date2 
				// return == 0 means date1 is the same day as date2 
				// return < 0 means date1 is earlier than date2 
				return Math.ceil(date1.getTime()/one_day) - Math.ceil(date2.getTime()/one_day);
			},
			sumDays : function( date, n_days ) {
				var origDateType = typeof date;
				obj_date = dateConvert.call(this, date);
				obj_date.setDate(obj_date.getDate() + n_days);
				return dateConvert.call(this, obj_date, origDateType);
			},
			dateConvert : function( date, desired_format, dateFormat ) {
				if(typeof date == desired_format) return date;
				
				var $this = $(this);
				if(typeof date == 'undefined') date = new Date(0);
				
				if(desired_format != 'string' && desired_format != 'object')
					$.error('Date format "'+ desired_format +'" not supported on jQuery.multiDatesPicker');
				
				var conversion = typeof date + '->' + desired_format;
				if(!dateFormat) {
					dateFormat = $.datepicker._defaults.dateFormat;
					
					// thanks to bibendus83 -> http://sourceforge.net/tracker/index.php?func=detail&aid=3213174&group_id=358205&atid=1495382
					var dp_dateFormat = $this.datepicker('option', 'dateFormat');
					if (dp_dateFormat) {
						dateFormat = dp_dateFormat;
					}
				}
				switch(conversion) {
					case 'object->string':
						return $.datepicker.formatDate(dateFormat, date);
					case 'string->object':
						return $.datepicker.parseDate(dateFormat, date);
					default:
						$.error('Conversion "'+ conversion +'" not allowed on jQuery.multiDatesPicker');
				}
				return false;
			},
			gotDate : function( date, type ) {
				if(!type) type = 'picked';
				for(var i = 0; i < this.multiDatesPicker.dates[type].length; i++) {
					if(methods.compareDates(dateConvert.call(this, this.multiDatesPicker.dates[type][i]), dateConvert.call(this, date)) == 0) {
						return i;
					}
				}
				return false;
			},
			getDates : function( format, type ) {
				if(!type) type = 'picked';
				switch (format) {
					case 'object':
						return this.multiDatesPicker.dates[type];
					default:
						var o_dates = new Array();
						for(var i in this.multiDatesPicker.dates[type])
							o_dates.push(
								dateConvert.call(
									this, 
									this.multiDatesPicker.dates[type][i], 
									'string'
								)
							);
						return o_dates;
				}
			},
			addDates : function( dates, type ) {
				if(!type) type = 'picked';
				switch(typeof dates) {
					case 'object':
					case 'array':
						if(dates.length) {
							for(var i in dates)
								addDate.call(this, dates[i], type, true);
							sortDates.call(this, type);
							break;
						} // else does the same as 'string'
					case 'string':
						addDate.call(this, dates, type);
						break;
					default: 
						$.error('Date format "'+ typeof dates +'" not allowed on jQuery.multiDatesPicker');
				}
				$(this).datepicker('refresh');
			},
			removeDates : function( indexes, type ) {
				if(!type) type = 'picked';
				if (Object.prototype.toString.call(indexes) === '[object Array]')
					for(var i in indexes) removeDate.call(this, i, type);
				else
					removeDate.call(this, indexes, type);
				$(this).datepicker('refresh');
			},
			resetDates : function ( type ) {
				if(!type) type = 'picked';
				this.multiDatesPicker.dates[type] = [];
				$(this).datepicker('refresh');
			},
			toggleDate : function( date, type ) {
				if(!type) type = 'picked';
				var index = methods.gotDate.call(this, date);
				var mode = this.multiDatesPicker.mode;
				
				switch(mode.modeName) {
					case 'daysRange':
						this.multiDatesPicker.dates[type] = []; // deletes all picked/disabled dates
						var end = mode.options.autoselectRange[1];
						var begin = mode.options.autoselectRange[0];
						if(end < begin) { // switch
							end = mode.options.autoselectRange[0];
							begin = mode.options.autoselectRange[1];
						}
						for(var i = begin; i < end; i++) 
							methods.addDates.call(this, methods.sumDays(date, i), type);
						break;
					default:
						if(index === false) // adds dates
							methods.addDates.call(this, date, type);
						else // removes dates
							methods.removeDates.call(this, index, type);
						break;
				}
			}, 
			setMode : function( mode ) {
				this.multiDatesPicker.mode.modeName = mode.modeName;
				var option;
				switch(mode.modeName) {
					case 'normal':
						for(option in mode.options)
							switch(option) {
								case 'maxPicks':
								case 'minPicks':
								case 'pickableRange':
								case 'pickableRangeDelay':
								case 'adjustRangeToDisabled':
									this.multiDatesPicker.mode.options[option] = mode.options[option];
									break;
								default: $.error('Option ' + option + ' does not exist for setMode on jQuery.multiDatesPicker');
							}
					break;
					case 'daysRange':
					case 'weeksRange':
						var mandatory = 1;
						for(option in mode.options)
							switch(option) {
								case 'autoselectRange':
									mandatory--;
								case 'pickableRange':
								case 'pickableRangeDelay':
								case 'adjustRangeToDisabled':
									this.multiDatesPicker.mode.options[option] = mode.options[option];
									break;
								default: $.error('Option ' + option + ' does not exist for setMode on jQuery.multiDatesPicker');
							}
						if(mandatory > 0) $.error('Some mandatory options not specified!');
					break;
				}
				
				if(mode.options.pickableRange) {
					$(this).datepicker("option", "maxDate", mode.options.pickableRange + (mode.options.pickableRangeDelay || 0));
					$(this).datepicker("option", "minDate", this.multiDatesPicker.minDate);
				}
				
				if(mdp_events.onSelect) mdp_events.onSelect();
				$(this).datepicker('refresh');
			}
		};
		
		this.each(function() {
			if (!this.multiDatesPicker) 
				this.multiDatesPicker = {
					dates: {
						picked: [],
						disabled: []
					},
					mode: {
						modeName: 'normal',
						options: {
							adjustRangeToDisabled: true
						}
					}
				};
			
			if(methods[method]) {
				var exec_result = methods[method].apply(this, Array.prototype.slice.call(mdp_arguments, 1));
				switch(method) {
					case 'getDates':
					case 'gotDate':
					case 'sumDays':
					case 'compareDates':
					case 'dateConvert':
						ret = exec_result;
				}
				return exec_result;
			} else if( typeof method === 'object' || ! method ) {
				return methods.init.apply(this, mdp_arguments);
			} else {
				$.error('Method ' +  method + ' does not exist on jQuery.multiDatesPicker');
			}
			return false;
		});
		
		if(method != 'gotDate' && method != 'getDates') {
			aaaa = 1;
		}
		
		return ret;
	};

	var PROP_NAME = 'multiDatesPicker';
	var dpuuid = new Date().getTime();
	var instActive;

	$.multiDatesPicker = {version: false};
	//$.multiDatesPicker = new MultiDatesPicker(); // singleton instance
	$.multiDatesPicker.initialized = false;
	$.multiDatesPicker.uuid = new Date().getTime();
	$.multiDatesPicker.version = $.ui.multiDatesPicker.version;

	// Workaround for #4055
	// Add another global to avoid noConflict issues with inline event handlers
	window['DP_jQuery_' + dpuuid] = $;
})( jQuery );