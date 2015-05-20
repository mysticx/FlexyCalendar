
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
			return (
				React.createElement(RouteHandler, null)
			);
		}
	}
});

var routes = (
	React.createElement(Route, {name: "app", path: "/", handler: FlexyCalendarApp}, 
	    React.createElement(Route, {name: "calendar", handler: Calendar}), 
	    React.createElement(DefaultRoute, {handler: Calendar})
  	)	
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  	React.render(React.createElement(Handler, null), document.getElementById('content'));
});

// React.render(
//   <FlexyCalendarApp />,
//   document.getElementById('content')
// );


//<DaysContainer days={this.state.days} key={this.state.currentDate.format(constants.calendarMonthFormat)} />