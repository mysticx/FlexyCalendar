(function ($, undefined) {
	'use strict';

	var ds = {};
	ds.defaultApiRoute = 'http://' + window.location.hostname + ':8080/api';    
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

    ds.localDB = {
        event_period_types: []    
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

    ds.is_logged = function (success, error) {
        ds.ajax({
            success: success,
            url: ds.defaultApiRoute + '/is_logged',
            type: 'GET',
            error: error
        });
    };

    ds.get_eventPeriodTypes = function (success, error) {
        if(localDB.event_period_types.length > 0){
            success(localDB.event_period_types);
        } else {
            ds.ajax({
                success: function (data) {
                    localDB.event_period_types = data;
                    success(data);
                },
                url: ds.defaultApiRoute + '/event_period_type?format=json',
                type: 'GET',
                error: error
            });
        }  
    };

	window.FlexyDS = {
		login: ds.login,
        is_logged: ds.is_logged
	};	
})(jQuery);