var FlexyUtils = {
	getQueryString: function() {
    	return window.location.search.replace(/^\?/, "").replace(/\/$/, "");
  	},
  	getQueryStringProperty: function(prop) {
	    var pairs = this.getQueryString().split("&");
	    var properties = {};

	    pairs.forEach(function(pair) {
	      pair = pair.split("=");
	      properties[ pair[0] ] = pair[1];
	    });

	    return properties[prop];
  	},
  	formatQueryString: function(properties) {
	    var property;
	    var queryString = [];

	    for (property in properties) {
	      if (properties.hasOwnProperty(property)) {
	        queryString.push("" + property + "=" + properties[property]);
	      }
	    }

	    return "?" + queryString.join("&");
  	},
	generateDatesArray: function (year, month) {		
		var currDate = moment({year: year, month: month, day: 1}),
			daysInMonth = currDate.daysInMonth(),
			days = [],
			firstOfMonth = moment(currDate), //copy from currDate
			lastOfMonth = moment(currDate).date(daysInMonth),
			currDay = moment(firstOfMonth).subtract(1, 'days');

		// get the days in the first week from the previous month
		for (var i = firstOfMonth.weekday(); i > 0; i--) {				
			days.unshift({ 
				shortDate: currDay.date(),
				longDate: currDay.format('DD.MM.YYYY'),
				isOutsideMonth: true
			});
			currDay.subtract(1, 'days');
		};

		// get the current month's days
		var longDateTail = currDate.format('.MM.YYYY');
		for (var i = 1; i <= currDate.daysInMonth(); i++) {
			days.push({ 
				shortDate: i,
				longDate: i + longDateTail,
				isOutsideMonth: false
			});
		};

		// get the days from the next month in the last week
		var nextMonth = moment(lastOfMonth).add(1, 'days'),
			longDateTail = nextMonth.format('.MM.YYYY'),
			weekday = lastOfMonth.weekday() === 6 ? -1 : lastOfMonth.weekday();
		for (var i = 1, count = 7 - weekday; i < count ; i++) {
			days.push({ 
				shortDate: i,
				longDate: i + longDateTail,
				isOutsideMonth: true
			});
		};

		return days;
	}
}