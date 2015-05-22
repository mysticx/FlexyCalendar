(function ($, undefined) {
	'use strict';

	var ds = {};
	ds.defaultApiRoute = 'http://localhost:8080/api';
	ds.DefaultAjaxOptions = function () {
		this.contentType = 'application/json; charset=utf-8';
        //this.dataType = 'json';
        this.processData = false;
        this.crossDomain = true;        
        this.xhrFields = {
            withCredentials: true
        };
        this.error = function (httpResponse) {
        	if (httpResponse.status === 401) {

        	};
        }
	};


	ds.ajax = function (options) {
		var ajax_options = new ds.DefaultAjaxOptions();		
		$.extend(ajax_options, options);

		$.ajax(ajax_options);
	};

	ds.login = function (username, password, success) {
		var data = {
			'username': username,
			'password': password,			
		};

		ds.ajax({ 
			data: JSON.stringify(data), 
			success: success, 
			url: ds.defaultApiRoute + '/login', 
			type: 'POST'
		});
	};    

	window.FlexyDS = {
		login: ds.login
	};	
})(jQuery);