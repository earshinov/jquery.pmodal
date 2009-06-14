/*
 * jquery.pmodal @VERSION - jQuery Plugin
 * http://github.com/earshinov/jquery.pmodal/
 *
 * Copyright (c) 2009 Eric Martin
 * Copyright (c) 2009 Eugene Arshinov
 *
 * Dual licensed under the MIT and GPL licenses
 */

/**
 * jquery.pmodal is a jQuery plugin that provides a simple
 * interface to create a modal dialog.
 *
 * It's based on Eric Martin's SimpleModal
 * (http://www.ericmmartin.com/projects/simplemodal/) and was reworked to
 * accomodate CSS positioning techniques from the
 * "CSS Modal Dialog that Works Right" article by Isaac Schlueter
 * (http://foohack.com/2007/11/css-modal-dialog-that-works-right/).
 *
 * This ensures consistent modal dialog scrolling behaviour even when
 * the dialog is larger than window area. Most modal dialog implementations
 * do not give attension to this issue.
 *
 * --- Typical usage ----------------------------------------------------------
 *
 * --- Prepare - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * First of all, you must apply certain styles to 'html' and 'body' elements
 * so that this modal dialog works. Your page should look like this:
 *
 * <html class='pmodal-html'>
 *  <body class='pmodal-body'>
 *    <div class='pmodal-content'>
 *      Your content goes here.
 *    </div>
 *  </body>
 * </html>
 *
 * --- Create - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * There are two ways to create dialog:
 *
 * 1. As a chained function on a jQuery object, like $('#myDiv').modal();.
 * This call would place the DOM object, #myDiv, inside a modal dialog.
 * An optional options object can be passed as a parameter.
 *
 *   @example $('<div>my data</div>').modal({options});
 *   @example $('#myDiv').modal({options});
 *   @example jQueryObject.modal({options});
 *
 * 2. As a stand-alone function, like $.modal(data). The data parameter
 * is required and an optional options object can be passed as a second
 * parameter. This method provides more flexibility in the types of data
 * that are allowed. The data could be a DOM object or a jQuery object.
 *
 *   @example $.modal($('<div>my data</div>'), {options});
 *   @example $.modal($('#myDiv'), {options});
 *   @example $.modal(jQueryObject, {options});
 *   @example $.modal(document.getElementById('myDiv'), {options});
 *
 * A call can contain multiple elements, but only one modal
 * dialog can be created at a time. Which means that all of the matched
 * elements will be displayed within the modal container.
 *
 * --- Customize - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * Please see comments before $.modal.defaults to see the list
 * of available options.
 *
 * --- Close - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * To close a running dialog, call $.modal.close();
 *
 * --- Styling ----------------------------------------------------------------
 *
 * The plugin provides minimal styling. If you'd like to customize
 * dialog's look and feel, style the elements you pass to $.modal().
 *
 * Please note that wrappers placed by the plugin around the elements
 * do not have 'position: relative' as distinct from SimpleModal.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * To make an element within your dialog to close it, add there
 * 'pmodal-close' class (you can override class name passing 'closeClass'
 * option to $.modal()). Example:
 *
 * <div id='my-dialog'>
 *  <a href='#' class='pmodal-close'>Close</a>
 * </div>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * A typical task is to add a close icon to the top right corner of the
 * dialog. We use an approach somewhat different from SimpleModal's one.
 * To add the icon
 *
 * - ensure that your dialog has 'position: relative';
 * - and place an element with 'pmodal-close-image' style within your dialog.
 *
 * Please note that the icon won't close the dialog unless you pass
 * 'pmodal-close' class additionally. Example:
 *
 * <div id='my-dialog' style='position: relative;'>
 *   <a href='#' class='pmodal-close pmodal-close-image'></a>
 *   Dialog content goes here.
 * </div>
 *
 * --- Callbacks --------------------------------------------------------------
 *
 * You can supply some callbacks to customize dialog behaviour and apply
 * special effects. They are 'onOpen', 'onShow' and 'onClose' options
 * which you may pass to $.modal().
 *
 * Each callback takes ome argument - an object describing the dialog. It
 * contains two attributes:
 *
 *   overlays:
 *     Overlay elements added by the plugin. For example, you may wish
 *     to use it in your 'onShow' and 'onClose' callbacks to provide animation.
 *
 *   data:
 *     The element you passed to $.modal() or its copy.
 *
 * --- onOpen - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * Called before the plugin shows the dialog. If you supply this callback,
 * you should show 'overlays' and 'data' in it.
 *
 * You may use this callback for animation. E.g.,
 *
 * function modalOpen(dialog){
 *   dialog.overlays.fadeIn('slow', function(){
 *     dialog.data.slideDown('slow');
 *   });
 * }
 *
 * --- onShow - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * Called after the dialog is shown.
 *
 * --- onClose - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * Called before the plugin destroys the dialog. If you supply this callback,
 * you should call $.modal.close() from it.
 *
 * You may use this callback for animation. E.g.,
 *
 * function modalClose(dialog){
 *   dialog.data.fadeOut('slow', function(){
 *     dialog.overlays.slideUp('slow', function(){
 *       $.modal.close();
 *     });
 *   });
 * }
 *
 * --- Browser Compability ----------------------------------------------------
 *
 * Tested in the following browsers:
 * - IE 6
 * - Firefox 3
 * - Opera 9
 * - Chrome 1
 *
 * --- Tests ------------------------------------------------------------------
 *
 * TODO:
 *
 * --- TODO -------------------------------------------------------------------
 *
 * - provide options to assign custom classes to overlays (may be used
 *   for further customization; like in SimpleModal);
 *
 * - provide a test demonstration dialog behavious with 'overClose'
 *   options set to 'true';
 *
 * - prevent focus border to appear around the close icon (e.g., in Firefox 3);
 *
 * - [hard] focus changing with Tab only within a dialog when it's shown
 *   (insufficient implementation in SimpleModal and buggy implementation
 *    in 'CSS Modal Dialog that Works Right').
 */
;(function ($) {
  /*
   * Stand-alone function to create a modal dialog.
   *
   * @param {object} data A jQuery object or DOM object
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
   * opacity:          (Number:0.5) The opacity value for the overlay div, from 0.0 to 1.0
   * background_color: (String:'333333') Overlay background color in 6-digit hex form without '#'
   *
   * close:            (Boolean:true) If true, closeClass, escClose and overClose will be used if set.
   * closeClass:       (String:'pmodal-close') The CSS class used to bind to the close event
   * escClose:         (Boolean:true) Allow Esc keypress to close the dialog?
   * overlayClose:     (Boolean:false) Allow click on overlay to close the dialog?
   *
   * persist:          (Boolean:false) Persist the data across modal calls? Only used for existing
   *                   DOM elements. If true, the data will be maintained across
   *                   modal calls, if false, the data will be reverted to its original state.
   *
   * onOpen:           (Function:null) The callback function used in place of built-in open
   * onShow:           (Function:null) The callback function used after the modal dialog has opened
   * onClose:          (Function:null) The callback function used in place of built-in close
   */
  $.modal.defaults = {
    opacity: 0.5,
    background_color: '333333',

    close: true,
    closeClass: 'pmodal-close',
    escClose: true,
    overlayClose: false,

    persist: false,

    onShow: null,
    onOpen: null,
    onClose: null
  };

  /*
   * Main modal object
   */
  $.modal.impl = {
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

      // onClose callback call flag
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
      var body = $('body');
      var ie = $.browser.msie && parseInt($.browser.version, 10) < 8;
      var $overlays = $([]);

      if (!ie)
        $overlays = $overlays.add(
          $(document.createElement('div'))
            .addClass('pmodal-overlay-decorator')
            .css({
              'background-color': '#' + this.opts.background_color,
              'display': 'none',
              'opacity': this.opts.opacity
            })
            .appendTo(body)
        );

      var $overlay = $(document.createElement('div'))
        .addClass('pmodal-overlay')
        .css('display', 'none')
        .appendTo(body);
      if (ie) {
        var clr = parseInt(this.opts.opacity * 255)
		    clr = ''.concat((clr < 16) ? '0' : '', clr.toString(16), this.opts.background_color);
        var filter = 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#' + clr + ',endColorstr=#' + clr + ');'
		    $overlay.css('filter', filter);
      }
      $overlays = $overlays.add($overlay);

      var $container = $(document.createElement('table'))
        .attr('cellspacing', '0')
        .addClass('pmodal-container')
        .appendTo($overlay);
      var $tr = $(document.createElement('tr'))
        .appendTo($container);
      var $dialog = $(document.createElement('td'))
        .addClass('pmodal-dialog')
        .appendTo($tr);
      data.appendTo($dialog);

      this.dialog.overlays = $overlays;
      this.dialog.data = data;

      if ($.isFunction(this.opts.onOpen))
        this.opts.onOpen.apply(this, [this.dialog]);
      else {
        $overlays.show();
        data.show();
      }

      if ($.isFunction(this.opts.onShow))
        this.opts.onShow.apply(this, [this.dialog]);

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
        $(document).bind('click.simplemodal', function (e) {
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
      $(document)
        .unbind('click.simplemodal')
        .unbind('keydown.simplemodal');
    },
    /*
     * Close the modal dialog
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
        this.dialog.overlays.remove();

        // reset the dialog object
        this.dialog = {};
      }
    }
  };
})(jQuery);
