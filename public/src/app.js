
var Router = window.ReactRouter,
	Route = Router.Route,
	DefaultRoute = Router.DefaultRoute,
	RouteHandler = Router.RouteHandler;

var FlexyCalendarApp = React.createClass({
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
				<div>
					<FlexyAuth onUserAuthenticated={this.userAuthenticated} />
				</div>
			);
		} else {

			history.pushState({year: moment().year(), month: moment().month()}, "Calendar page", "/calendar/" + moment().year() + '/' + moment().month());

			return (
				<RouteHandler />
			);
		}
	}
});

var routes = (
	<Route name="app" path="/" handler={FlexyCalendarApp} >
	    <Route name="calendar" path="/calendar/:year/:month" handler={Calendar} />
	    // <DefaultRoute handler={Calendar} />
  	</Route>	
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  	React.render(<Handler />, document.getElementById('content'));
});



// Router.run(routes, Router.HistoryLocation, function (Handler, state) {
//   	React.render(<Handler params={state.params} />, document.getElementById('content'));
// });

