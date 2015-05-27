
var Router = window.ReactRouter,
	Route = Router.Route,
	DefaultRoute = Router.DefaultRoute,
	RouteHandler = Router.RouteHandler;

var FlexyCalendarApp = React.createClass({displayName: "FlexyCalendarApp",
  	userAuthenticated: function () {
  		this.setState({
  			isAuthenticated: true
  		});
  	},
  	getInitialState: function () {	
		return {
			isAuthenticated: false,
			checkingAuth: true
		};	
	},
	render: function  () {
		var self = this;
		if (this.state.checkingAuth) {
			window.FlexyDS.is_logged(function () {
				self.setState({
					isAuthenticated: true,
					checkingAuth: false
				});
			}, function (jqXHR, textStatus, errorThrown) {
				if(jqXHR.status === 401) {
					self.setState({
						isAuthenticated: false,
						checkingAuth: false
					});
				}
			});


			return (React.createElement("div", null));
		} else {
			if (!this.state.isAuthenticated) {
				return ( 
					React.createElement("div", null, 
						React.createElement(FlexyAuth, {onUserAuthenticated: this.userAuthenticated})
					)
				);
			} else {
				return (
					React.createElement(RouteHandler, null)
				);
			}
		}
	}
});

var routes = (
	React.createElement(Route, {name: "app", path: "/", handler: FlexyCalendarApp}, 
	    React.createElement(Route, {name: "calendar", path: "/calendar/:year/:month", handler: Calendar})
  	)	
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  	React.render(React.createElement(Handler, null), document.getElementById('content'));
});
