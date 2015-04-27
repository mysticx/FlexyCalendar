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
  	}
}