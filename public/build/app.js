
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
			isAuthenticated: false
		};	
	},
	render: function  () {
		if (!this.state.isAuthenticated) {
			return ( 
				React.createElement("div", null, 
					React.createElement(FlexyAuth, {onUserAuthenticated: this.userAuthenticated})
				)
			);
		} else {

			history.pushState({year: moment().year(), month: moment().month()}, "Calendar page", "/calendar/" + moment().year() + '/' + moment().month());

			return (
				React.createElement(RouteHandler, null)
			);
		}
	}
});

var routes = (
	React.createElement(Route, {name: "app", path: "/", handler: FlexyCalendarApp}, 
	    React.createElement(Route, {name: "calendar", path: "/calendar/:year/:month", handler: Calendar}), 
	    "// ", React.createElement(DefaultRoute, {handler: Calendar})
  	)	
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  	React.render(React.createElement(Handler, null), document.getElementById('content'));
});



// Router.run(routes, Router.HistoryLocation, function (Handler, state) {
//   	React.render(<Handler params={state.params} />, document.getElementById('content'));
// });

