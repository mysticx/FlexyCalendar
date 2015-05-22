var Input = window.ReactBootstrap.Input,
	Alert = window.ReactBootstrap.Alert;


var RegisterPanel = React.createClass({
	render: function () {
		return (<div></div>);
	}
});

var LogInView = React.createClass({
	loginTransitionEnd: function (event) {
		if (event.srcElement.classList.contains('form-control')){
			event.stopPropagation();
			return;
		} else {
			this.props.onLoginSuccess();
		};
		
	},
	getInitialState: function () {
		return {
			failedLogIn: false
		};
	},
	authenticateUser: function (e) {
		//var transitionEnd = this.loginTransitionEnd;

		FlexyDS.login(this.refs.usernameInput.getValue(), this.refs.passwordInput.getValue(), function (data) {
			if (data.success) {				
				document.getElementById('login-form').addEventListener('transitionend', this.loginTransitionEnd, false);
				var logInForm = document.getElementById('login-form');
				logInForm.classList.add('flyout');	
			} else {
				this.setState({
					failedLogIn: true,
					errorMessage: data.error
				});
			}
		}.bind(this));

		e.preventDefault();
	},
	render: function () {
		var alert;

		if (this.state.failedLogIn) {
			var message;

			if (this.state.errorMessage) {
				message = this.state.errorMessage;
			} else {
				message = 'The credentials you provided were not correct!';
			}

			alert = <Alert bsStyle="danger" >
						<h4>{message}</h4>
					</Alert>				
		}

		return (<form id="login-form" className="login-form" ref="logInForm" onSubmit={this.authenticateUser}>
					<Input ref="usernameInput" type="text" label="Username:" placeholder="Enter your username email here..." />	
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
