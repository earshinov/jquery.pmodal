/*
 * SimpleModal Contact Form
 * http://www.ericmmartin.com/projects/simplemodal/
 * http://code.google.com/p/simplemodal/
 *
 * Copyright (c) 2009 Eric Martin - http://ericmmartin.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Revision: $Id: contact.js 185 2009-02-09 21:51:12Z emartin24 $
 *
 */

$(document).ready(function () {
	$('#contactForm input.contact, #contactForm a.contact').click(function (e) {
		e.preventDefault();

		data=" \
<div id='contact' style='display:none'> \
<a href='#' title='Close' class='modalCloseX pmodal-close'>x</a> \
<div class='contact-top'></div> \
<div class='contact-content'> \
<h1 class='contact-title'>Send us a message:</h1> \
<div class='contact-loading' style='display:none'></div> \
<div class='contact-message' style='display:none'></div> \
<form action='#' style='display:none'> \
\
<label for='contact-name'>*Name:</label> \
<input type='text' id='contact-name' class='contact-input' name='name' tabindex='1001' /> \
<label for='contact-email'>*Email:</label> \
<input type='text' id='contact-email' class='contact-input' name='email' tabindex='1002' /> \
\
<label for='contact-subject'>Subject:</label> \
<input type='text' id='contact-subject' class='contact-input' name='subject' value='' tabindex='1003' /> \
\
<label for='contact-message'>*Message:</label> \
<textarea id='contact-message' class='contact-input' name='message' cols='40' rows='4' tabindex='1004'></textarea> \
<br/> \
\
<label>&nbsp;</label> \
<input type='checkbox' id='contact-cc' name='cc' value='1' tabindex='1005' /> <span class='contact-cc'>Send me a copy</span> \
<br/> \
\
<label>&nbsp;</label> \
<button type='submit' class='contact-send contact-button' tabindex='1006'>Send</button> \
<button type='submit' class='contact-cancel contact-button pmodal-close' tabindex='1007'>Cancel</button> \
<br/> \
\
</form> \
</div> \
<div class='contact-bottom'><a href='http://www.ericmmartin.com/projects/simplemodal/'>Powered by SimpleModal</a></div> \
</div>";

		$(data).modal({
			close: false,
			onOpen: contact.open,
			onShow: contact.show,
			onClose: contact.close
		});
	});

	// preload images
	var img = ['cancel.png', 'form_bottom.gif', 'form_top.gif', 'loading.gif', 'send.png'];
	$(img).each(function () {
		var i = new Image();
		i.src = 'img/contact/' + this;
	});
});

var contact = {
	message: null,
	open: function (dialog) {
		// add padding to the buttons in firefox/mozilla
		if ($.browser.mozilla) {
			$('#contact .contact-button').css({
				'padding-bottom': '2px'
			});
		}
		// input field font size
		if ($.browser.safari) {
			$('#contact .contact-input').css({
				'font-size': '.9em'
			});
		}

		// dynamically determine height
		var h = 280;
		if ($('#contact-subject').length) {
			h += 26;
		}
		if ($('#contact-cc').length) {
			h += 22;
		}

		var title = $('#contact .contact-title').html();
		$('#contact .contact-title').html('Loading...');
		dialog.overlays.fadeIn(200, function () {
			dialog.data.fadeIn(200, function () {
				$('#contact .contact-content').animate({
					height: h
				}, function () {
					$('#contact .contact-title').html(title);
					$('#contact form').fadeIn(200, function () {
						$('#contact #contact-name').focus();

						$('#contact .contact-cc').click(function () {
							var cc = $('#contact #contact-cc');
							cc.is(':checked') ? cc.attr('checked', '') : cc.attr('checked', 'checked');
						});

						// fix png's for IE 6
						if ($.browser.msie && $.browser.version < 7) {
							$('#contact .contact-button').each(function () {
								if ($(this).css('backgroundImage').match(/^url[("']+(.*\.png)[)"']+$/i)) {
									var src = RegExp.$1;
									$(this).css({
										backgroundImage: 'none',
										filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' +  src + '", sizingMethod="crop")'
									});
								}
							});
						}
					});
				});
			});
		});
	},
	show: function (dialog) {
		$('#contact .contact-send').click(function (e) {
			e.preventDefault();
			// validate form
			if (contact.validate()) {
				$('#contact .contact-message').fadeOut(function () {
					$('#contact .contact-message').removeClass('contact-error').empty();
				});
				$('#contact .contact-title').html('Sending...');
				$('#contact form').fadeOut(200);
				$('#contact .contact-content').animate({
					height: '80px'
				}, function () {
					$('#contact .contact-loading').fadeIn(200, function () {
						$.ajax({
							url: 'data/contact.php',
							data: $('#contact form').serialize() + '&action=send',
							type: 'post',
							cache: false,
							dataType: 'html',
							complete: function (xhr) {
								$('#contact .contact-loading').fadeOut(200, function () {
									$('#contact .contact-title').html('Thank you!');
									$('#contact .contact-message').html(xhr.responseText).fadeIn(200);
								});
							},
							error: contact.error
						});
					});
				});
			}
			else {
				if ($('#contact .contact-message:visible').length > 0) {
					var msg = $('#contact .contact-message div');
					msg.fadeOut(200, function () {
						msg.empty();
						contact.showError();
						msg.fadeIn(200);
					});
				}
				else {
					$('#contact .contact-message').animate({
						height: '30px'
					}, contact.showError);
				}

			}
		});
	},
	close: function (dialog) {
		$('#contact .contact-message').fadeOut();
		$('#contact .contact-title').html('Goodbye...');
		$('#contact form').fadeOut(200);
		$('#contact .contact-content').animate({
			height: 40
		}, function () {
			dialog.data.fadeOut(200, function () {
				dialog.data.fadeOut(200, function () {
					$.modal.close();
				});
			});
		});
	},
	error: function (xhr) {
		alert(xhr.statusText);
	},
	validate: function () {
		contact.message = '';
		if (!$('#contact #contact-name').val()) {
			contact.message += 'Name is required. ';
		}

		var email = $('#contact #contact-email').val();
		if (!email) {
			contact.message += 'Email is required. ';
		}
		else {
			if (!contact.validateEmail(email)) {
				contact.message += 'Email is invalid. ';
			}
		}

		if (!$('#contact #contact-message').val()) {
			contact.message += 'Message is required.';
		}

		if (contact.message.length > 0) {
			return false;
		}
		else {
			return true;
		}
	},
	validateEmail: function (email) {
		var at = email.lastIndexOf("@");

		// Make sure the at (@) sybmol exists and
		// it is not the first or last character
		if (at < 1 || (at + 1) === email.length)
			return false;

		// Make sure there aren't multiple periods together
		if (/(\.{2,})/.test(email))
			return false;

		// Break up the local and domain portions
		var local = email.substring(0, at);
		var domain = email.substring(at + 1);

		// Check lengths
		if (local.length < 1 || local.length > 64 || domain.length < 4 || domain.length > 255)
			return false;

		// Make sure local and domain don't start with or end with a period
		if (/(^\.|\.$)/.test(local) || /(^\.|\.$)/.test(domain))
			return false;

		// Check for quoted-string addresses
		// Since almost anything is allowed in a quoted-string address,
		// we're just going to let them go through
		if (!/^"(.+)"$/.test(local)) {
			// It's a dot-string address...check for valid characters
			if (!/^[-a-zA-Z0-9!#$%*\/?|^{}`~&'+=_\.]*$/.test(local))
				return false;
		}

		// Make sure domain contains only valid characters and at least one period
		if (!/^[-a-zA-Z0-9\.]*$/.test(domain) || domain.indexOf(".") === -1)
			return false;

		return true;
	},
	showError: function () {
		$('#contact .contact-message')
			.html($('<div class="contact-error">').append(contact.message))
			.fadeIn(200);
	}
};
