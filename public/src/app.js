
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


			return (<div></div>);
		} else {
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
	}
});

var routes = (
	<Route name="app" path="/" handler={FlexyCalendarApp} >
	    <Route name="calendar" path="/calendar/:year/:month" handler={Calendar} />
  	</Route>	
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  	React.render(<Handler />, document.getElementById('content'));
});
