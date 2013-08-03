/**
 *	https://github.com/emiljohansson/ajax.js
 *	
 *	@version	0.1.2
 *	@author		Emil Johansson <emiljohansson.se@gmail.com>
 *	@date		Nov 9, 2012
 */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50 */
/*global ActiveXObject, alert, Util */
window.ajax = (function() {

	"use strict";

	var GET		= "GET",
		POST	= "POST";

	var readyState	= {
			uninitialized	: 0,
			loading			: 1,
			loaded			: 2,
			interactive		: 3,
			complete		: 4
		},
		status = {
			success	: 200
		};

	var method		= GET,
		async		= true,
		contentType	= "application/x-www-form-urlencoded; charset=UTF-8";

	function fixSettings(settings) {
		settings.method			= settings.method		|| method;
		settings.url			= settings.url			|| "";
		settings.async			= settings.async		|| async;
		settings.callback		= settings.callback		|| callback;
		settings.data			= settings.data			|| null;
		settings.contentType	= settings.contentType	|| contentType;
	}

	function callback() {}

	function create() {
		if (!window.XMLHttpRequest) {
			try {
				return new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e) {
				try {
					return new ActiveXObject("Microsoft.XMLHTTP");
				} 
				catch (err) {
					return null;
				}
			}
		}
		return new XMLHttpRequest();
	}

	return function(settings) {
		fixSettings(settings);
		var request = create();
		if (request === null || request === undefined) {
			alert("Request failed, your browser is not supported");
			return;
		}

		request.onreadystatechange = function() {
			if (request.readyState === readyState.complete) {
				if (request.status === status.success) {
					settings.callback(request.responseText);
				} 
				else {
					alert('There was a problem with the request.');
				}
			}
		};
		request.open(settings.method, settings.url, settings.async);

		if (settings.method.toUpperCase() === POST) {
			settings.contentType = 'application/x-www-form-urlencoded';
		}
		request.setRequestHeader('Content-Type', settings.contentType);

		if (settings.contentType === "json") {
			request.send(Util.json.parse(settings.data));
		}
		else {
			request.send(settings.data);
		}
	};
}());