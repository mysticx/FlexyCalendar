
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
			return (
				<RouteHandler />
			);
		}
	}
});

var routes = (
	<Route name="app" path="/" handler={FlexyCalendarApp}>
	    <Route name="calendar" handler={Calendar}/>
	    <DefaultRoute handler={Calendar}/>
  	</Route>	
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  	React.render(<Handler/>, document.getElementById('content'));
});

// React.render(
//   <FlexyCalendarApp />,
//   document.getElementById('content')
// );


//<DaysContainer days={this.state.days} key={this.state.currentDate.format(constants.calendarMonthFormat)} />