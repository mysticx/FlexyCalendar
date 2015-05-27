var Input = window.ReactBootstrap.Input,
    Alert = window.ReactBootstrap.Alert;


var RegisterPanel = React.createClass({displayName: "RegisterPanel",
    render: function () {
        return (React.createElement("div", null));
    }
});

var LogInView = React.createClass({displayName: "LogInView",
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

            alert = React.createElement(Alert, {bsStyle: "danger"}, 
                        React.createElement("h4", null, message)
                    )                
        }

        return (React.createElement("form", {id: "login-form", className: "login-form", ref: "logInForm", onSubmit: this.authenticateUser}, 
                    React.createElement(Input, {ref: "usernameInput", type: "text", label: "Username:", placeholder: "Enter your username email here..."}), 
                    React.createElement(Input, {ref: "passwordInput", type: "password", label: "Password:"}), 
                    alert, 
                    React.createElement(Input, {type: "submit", value: "Log in", className: "t-center"})
                ));
    }
});

var FlexyAuth = React.createClass({displayName: "FlexyAuth",
    getInitialState: function () {
        return {
            isRegisterScreenOn: false
        };
    },
    render: function () {
        var logInView,
            registerPanel;          

        return (
            React.createElement("div", {className: "flexy-auth-container"}, 
                React.createElement(LogInView, {onLoginSuccess: this.props.onUserAuthenticated}), 
                React.createElement(RegisterPanel, null)
            ));
    }
});
