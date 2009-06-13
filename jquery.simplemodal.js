/*
 * SimpleModal @VERSION - jQuery Plugin
 * http://www.ericmmartin.com/projects/simplemodal/
 * Copyright (c) 2009 Eric Martin
 * Dual licensed under the MIT and GPL licenses
 * Revision: $Id$
 */

/**
 * SimpleModal is a lightweight jQuery plugin that provides a simple
 * interface to create a modal dialog.
 *
 * The goal of SimpleModal is to provide developers with a cross-browser 
 * overlay and container that will be populated with data provided to
 * SimpleModal.
 *
 * There are two ways to call SimpleModal:
 * 1) As a chained function on a jQuery object, like $('#myDiv').modal();.
 * This call would place the DOM object, #myDiv, inside a modal dialog.
 * Chaining requires a jQuery object. An optional options object can be
 * passed as a parameter.
 *
 * @example $('<div>my data</div>').modal({options});
 * @example $('#myDiv').modal({options});
 * @example jQueryObject.modal({options});
 *
 * 2) As a stand-alone function, like $.modal(data). The data parameter
 * is required and an optional options object can be passed as a second
 * parameter. This method provides more flexibility in the types of data 
 * that are allowed. The data could be a DOM object, a jQuery object, HTML
 * or a string.
 * 
 * @example $.modal('<div>my data</div>', {options});
 * @example $.modal('my data', {options});
 * @example $.modal($('#myDiv'), {options});
 * @example $.modal(jQueryObject, {options});
 * @example $.modal(document.getElementById('myDiv'), {options}); 
 * 
 * A SimpleModal call can contain multiple elements, but only one modal 
 * dialog can be created at a time. Which means that all of the matched
 * elements will be displayed within the modal container.
 * 
 * SimpleModal internally sets the CSS needed to display the modal dialog
 * properly in all browsers, yet provides the developer with the flexibility
 * to easily control the look and feel. The styling for SimpleModal can be 
 * done through external stylesheets, or through SimpleModal, using the
 * overlayCss and/or containerCss options.
 *
 * SimpleModal has been tested in the following browsers:
 * - IE 6, 7, 8
 * - Firefox 2, 3
 * - Opera 9
 * - Safari 3
 * - Chrome 1, 2
 *
 * @name SimpleModal
 * @type jQuery
 * @requires jQuery v1.2.2
 * @cat Plugins/Windows and Overlays
 * @author Eric Martin (http://ericmmartin.com)
 * @version @VERSION
 */
;(function ($) {
	/*
	 * Stand-alone function to create a modal dialog.
	 * 
	 * @param {string, object} data A string, jQuery object or DOM object
	 * @param {object} [options] An optional object containing options overrides
	 */
	$.modal = function (data, options) {
		return $.modal.impl.init(data, options);
	};

	/*
	 * Stand-alone close function to close the modal dialog
	 */
	$.modal.close = function () {
		$.modal.impl.close();
	};

	/*
	 * Chained function to create a modal dialog.
	 * 
	 * @param {object} [options] An optional object containing options overrides
	 */
	$.fn.modal = function (options) {
		return $.modal.impl.init(this, options);
	};

	/*
	 * SimpleModal default options
	 * 
	 * appendTo:		(String:'body') The jQuery selector to append the elements to. For ASP.NET, use 'form'.
	 * opacity:			(Number:50) The opacity value for the overlay div, from 0 - 100
	 * overlayId:		(String:'simplemodal-overlay') The DOM element id for the overlay div
	 * overlayCss:		(Object:{}) The CSS styling for the overlay div
	 * containerId:		(String:'simplemodal-container') The DOM element id for the container div
	 * containerCss:	(Object:{}) The CSS styling for the container div
	 * dataId:			(String:'simplemodal-data') The DOM element id for the data div
	 * dataCss:			(Object:{}) The CSS styling for the data div
	 * zIndex:			(Number: 1000) Starting z-index value
	 * close:			(Boolean:true) If true, closeHTML, escClose and overClose will be used if set.
	 							If false, none of them will be used.
	 * closeHTML:		(String:'<a class="modalCloseImg" title="Close"></a>') The HTML for the 
							default close link. SimpleModal will automatically add the closeClass to this element.
	 * closeClass:		(String:'simplemodal-close') The CSS class used to bind to the close event
	 * escClose:		(Boolean:true) Allow Esc keypress to close the dialog? 
	 * overlayClose:	(Boolean:false) Allow click on overlay to close the dialog?
	 * persist:			(Boolean:false) Persist the data across modal calls? Only used for existing
								DOM elements. If true, the data will be maintained across modal calls, if false,
								the data will be reverted to its original state.
	 * onShow:			(Function:null) The callback function used after the modal dialog has opened
	 * onClose:			(Function:null) The callback function used in place of SimpleModal's close
	 */
	$.modal.defaults = {
		appendTo: 'body',
		opacity: 50,
		overlayId: 'simplemodal-overlay',
		overlayCss: {},
		containerId: 'simplemodal-container',
		containerCss: {},
		dataId: 'simplemodal-data',
		dataCss: {},
		zIndex: 1000,
		close: true,
		closeHTML: '<a class="modalCloseImg" title="Close"></a>',
		closeClass: 'simplemodal-close',
		escClose: true,
		overlayClose: false,
		persist: false,
		onShow: null,
		onClose: null
	};

	/*
	 * Main modal object
	 */
	$.modal.impl = {
		/*
		 * Modal dialog options
		 */
		opts: null,
		/*
		 * Contains the modal dialog elements and is the object passed 
		 * back to the callback (onOpen, onShow, onClose) functions
		 */
		dialog: {},
		/*
		 * Initialize the modal dialog
		 */
		init: function (data, options) {
			// don't allow multiple calls
			if (this.dialog.data) {
				return false;
			}

			// merge defaults and user options
			this.opts = $.extend({}, $.modal.defaults, options);

			// keep track of z-index
			this.zIndex = this.opts.zIndex;

			// set the onClose callback flag
			this.occb = false;

			// determine how to handle the data based on its type
			if (typeof data == 'object') {
				// convert DOM object to a jQuery object
				data = data instanceof jQuery ? data : $(data);

				// if the object came from the DOM, keep track of its parent
				if (data.parent().parent().size() > 0) {
					this.dialog.parentNode = data.parent();

					// persist changes? if not, make a clone of the element
					if (!this.opts.persist) {
						this.dialog.orig = data.clone(true);
					}
				}
			}
			else if (typeof data == 'string' || typeof data == 'number') {
				// just insert the data as innerHTML
				data = $('<div/>').html(data);
			}
			else {
				// unsupported data type!
				alert('SimpleModal Error: Unsupported data type: ' + typeof data);
				return false;
			}

      /* create the modal overlay and container */
			this.create(data);
			return this;
		},
		/*
		 * Create
		 */
		create: function (data) {
      var $overlay_deco = $(document.createElement('div'))
        .addClass('pmodal-overlay-decorator')
        .appendTo(this.opts.appendTo);
      var $overlay = $(document.createElement('div'))
        .addClass('pmodal-overlay')
        .appendTo(this.opts.appendTo);
      var $container = $(document.createElement('table'))
        .attr('cellspacing', '0')
        .addClass('pmodal-container')
        .appendTo($overlay);
      var $tr = $(document.createElement('tr'))
        .appendTo($container);
      var $dialog = $(document.createElement('div'))
        .addClass('pmodal-dialog')
        .appendTo($tr);
      data.appendTo($dialog);

      if ($.isFunction(this.opts.onShow)) {
				this.opts.onShow.apply(this, [this.dialog]);
			}
      data.show();

      this.dialog.overlay_deco = $overlay_deco;
      this.dialog.overlay = $overlay;
      this.dialog.data = data;

      this.bindEvents();
		},
		/*
		 * Bind events
		 */
		bindEvents: function () {
			var self = this;

			// bind the close event to any element with the closeClass class
			$('.' + self.opts.closeClass).bind('click.simplemodal', function (e) {
				e.preventDefault();
				self.close();
			});
			
			// bind the overlay click to the close function, if enabled
			if (self.opts.close && self.opts.overlayClose) {
				self.dialog.overlay.bind('click.simplemodal', function (e) {
					e.preventDefault();
					self.close();
				});
			}
	
			// bind keydown events
      if (self.opts.close && self.opts.escClose) {
        $(document).bind('keydown.simplemodal', function (e) {
          if (e.keyCode == 27) { // ESC
            e.preventDefault();
            self.close();
          }
        });
      }
		},
		/*
		 * Unbind events
		 */
		unbindEvents: function () {
			$('.' + this.opts.closeClass).unbind('click.simplemodal');
			$(document).unbind('keydown.simplemodal');
			this.dialog.overlay.unbind('click.simplemodal');
		},
		/*
		 * Close the modal dialog
		 * - Note: If you use an onClose callback, you must remove the 
		 *         overlay and container manually
		 *
		 * @param {boolean} external Indicates whether the call to this
		 *     function was internal or external. If it was external, the
		 *     onClose callback will be ignored
		 */
		close: function () {
			// prevent close when dialog does not exist
			if (!this.dialog.data) {
				return false;
			}

			// remove the default events
			this.unbindEvents();

			if ($.isFunction(this.opts.onClose) && !this.occb) {
				// set the onClose callback flag
				this.occb = true;

				// execute the onClose callback
				this.opts.onClose.apply(this, [this.dialog]);
			}
			else {
				// if the data came from the DOM, put it back
				if (this.dialog.parentNode) {
					// save changes to the data?
					if (this.opts.persist) {
						// insert the (possibly) modified data back into the DOM
						this.dialog.data.hide().appendTo(this.dialog.parentNode);
					}
					else {
						// remove the current and insert the original, 
						// unmodified data back into the DOM
						this.dialog.data.hide().remove();
						this.dialog.orig.appendTo(this.dialog.parentNode);
					}
				}
				else {
					// otherwise, remove it
					this.dialog.data.hide().remove();
				}

				// remove the remaining elements
				this.dialog.overlay_deco.hide().remove();
				this.dialog.overlay.hide().remove();

				// reset the dialog object
				this.dialog = {};
			}
		}
	};
})(jQuery);
