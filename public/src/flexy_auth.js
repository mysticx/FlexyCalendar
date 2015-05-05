
var RegisterPanel = React.createClass({
	render: function () {
		return (<div></div>);
	}
});

var LogInView = React.createClass({
	getInitialState: function () {
		return {
			failedLogIn: false
		};
	},
	authenticateUser: function (e) {
		if (this.refs.usernameInput.getValue() === 'a@a.a' && 
			this.refs.passwordInput.getValue() === '1') {
			debugger;
			//this.props.onLoginSuccess();
		} else {


			this.setState({
				failedLogIn: true
			});
		}

		e.preventDefault();
	},
	render: function () {
		var alert;
		if (this.state.failedLogIn) {
			alert = <Alert bsStyle="danger" >
						<h4>The credentials you provided were not correct!</h4>
					</Alert>
		}

		return (<form className="login-form" ref="logInForm" onSubmit={this.authenticateUser}>
					<Input ref="usernameInput" type="email" label="Username:" placeholder="Enter your username email here..." />	
					<Input ref="passwordInput" type="password" label="Password:" />
					{alert}	
					<Input type="submit" value="Log in" className="t-center"/>
				</form>);
	}
});

var FlexyAuth = React.createClass({
	getInitialState: function () {
		return {
			isRegisterScreenOn: false
		};
	},
	render: function () {
		var logInView,
			registerPanel;			

		return (
			<div className="flexy-auth-container">
				<LogInView onLoginSuccess={this.props.onUserAuthenticated} />
				<RegisterPanel />
			</div>);
	}
});
