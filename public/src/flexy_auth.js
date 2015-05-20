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
	componentDidMount: function () {		
		document.getElementById('login-form').addEventListener('transitionend', this.loginTransitionEnd, false);	
	},	
	authenticateUser: function (e) {
		if (this.refs.usernameInput.getValue() === 'a@a.a' && 
			this.refs.passwordInput.getValue() === '1') {

			var logInForm = document.getElementById('login-form');
			logInForm.classList.add('flyout');			
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

		return (<form id="login-form" className="login-form" ref="logInForm" onSubmit={this.authenticateUser}>
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
