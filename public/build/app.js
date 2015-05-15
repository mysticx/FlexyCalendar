var constants = {
	calendarMonthFormat: 'MMMM, YYYY',
	defaultMomentLanguage: 'en'
}

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
	Button = window.ReactBootstrap.Button,
	Glyphicon = window.ReactBootstrap.Glyphicon,
	Input = window.ReactBootstrap.Input
	Alert = window.ReactBootstrap.Alert;

var MonthNavButton = React.createClass({displayName: "MonthNavButton",
	changeMonth: function () {
		if (this.props.className === 'prev-month') {
			this.props.onChangeMonth(-1);
		} else if (this.props.className === 'next-month') {
			this.props.onChangeMonth(1);
		};
	},	
	render: function () {
		return (React.createElement("button", {onClick: this.changeMonth, className: "{this.props.className}"}, this.props.text));
	}
});

var CurrentMonthBar = React.createClass({displayName: "CurrentMonthBar",
	render: function () {
		return (
			React.createElement("nav", {className: "month-bar"}, 
				React.createElement(MonthNavButton, {className: "prev-month", text: "Prev", onChangeMonth: this.props.onChangeMonth}), 
				React.createElement("h3", {className: "selected-month"}, this.props.monthName), 
				React.createElement(MonthNavButton, {className: "next-month", text: "Next", onChangeMonth: this.props.onChangeMonth})
			)
		);
7	}
});

var WeekHeadersBar = React.createClass({displayName: "WeekHeadersBar",
	render: function () {
		return (React.createElement("ul", {className: "week-headers flex-container"}, 
					React.createElement("li", null, "Su"), 
					React.createElement("li", null, "Mo"), 
					React.createElement("li", null, "Tu"), 
					React.createElement("li", null, "We"), 
					React.createElement("li", null, "Th"), 
					React.createElement("li", null, "Fr"), 
					React.createElement("li", null, "Sa")
				));
	}
});


var DaysOfMonth = React.createClass({displayName: "DaysOfMonth",
	showEditPanel: function () {
		this.props.onOpenEdit(this.props.longDate);
	},
	render: function () {
		var cx = React.addons.classSet;
		var classes = cx({
			'outside-month': this.props.isOutsideMonth
		});
		return (React.createElement("li", {className: classes, "data-longDate": this.props.longDate}, 
					this.props.shortDate, 
					React.createElement("div", {className: "day-edit-bar"}, 						
						React.createElement("button", {className: "flat-button", onClick: this.showEditPanel}, 
							React.createElement(Glyphicon, {glyph: "pencil"})						
						), 

						React.createElement("button", {className: "flat-button"}, 
							React.createElement(Glyphicon, {glyph: "trash"})
						), 

						React.createElement("button", {className: "flat-button"}, 
							React.createElement(Glyphicon, {glyph: "star"})
						)						
					)
				))
	}
});

var DaysContainer = React.createClass({displayName: "DaysContainer",
	componentWillMount: function () {
		$('#content').removeClass('animations-on');
	},
	componentDidMount: function () {
		$('#content').addClass('animations-on');
	},
	render: function () {
		var displayDays = [];
		for (var i = 0, length = this.props.days.length, days = this.props.days; i < length; i++) {
			displayDays.push(React.createElement(DaysOfMonth, {
								shortDate: days[i].shortDate, 
								longDate: days[i].longDate, 
								isOutsideMonth: days[i].isOutsideMonth, 
								onOpenEdit: this.props.onOpenEdit}
								))
		};

		return React.DOM.ul({className:"days-container flex-container"}, displayDays);

		return (
			React.createElement("ul", {className: "days-container flex-container"}, 
				displayDays
			));
	}
});

var EditPanel = React.createClass({displayName: "EditPanel",
	render: function () {
		var cx = React.addons.classSet;
		var classes = cx({
			'animateIn': this.props.isEditing,
			'editPanel': true
		});

		var mEditDay = moment(this.props.editDay, 'DD.MM.YYYY');

		return (React.createElement("div", {className: classes}, 
					React.createElement("button", {onClick: this.props.onCloseEditPanel, className: "flat-button close-panel-button"}, 
						React.createElement(Glyphicon, {glyph: "remove"})
					), 
					React.createElement("h2", {className: "edit-panel-heading"}, "Events for ", mEditDay.lang(constants.defaultMomentLanguage).format('dddd, DD.MM.YYYY'))

				));
	}
});

var FlexyCalendar = React.createClass({displayName: "FlexyCalendar",
	changeMonth: function (offset) {
		var currDate = this.state.currentDate.add(offset, 'month');

		this.setState({
			currentDate: currDate,
			currentMonthName: currDate.lang(constants.defaultMomentLanguage).format(constants.calendarMonthFormat),
			days: FlexyUtils.generateDatesArray(currDate.year(), currDate.month())
		});
	},
	getQueryState: function () {
		var date = this.state.currentDate;

		return {
			year: date.year(),
			month: date.month()
		};
	},
  	componentWillUpdate: function(newProps, newState) {
	    // When the state changes push a query string so users can bookmark	  
	    window.history.pushState(null, null, FlexyUtils.formatQueryString(this.getQueryState()));
  	},
  	openDayEditPanel: function (editDay) {
  		this.setState({
  			isEditing: true,
  			editDay: editDay
  		});
  	},
  	closeEditPanel: function () {
  		this.setState({isEditing: false});	
  	},
  	userAuthenticated: function () {
  		this.setState({
  			isAuthenticated: true
  		});
  	},
	getInitialState: function () {
		var currDate,
		year = FlexyUtils.getQueryStringProperty('year'),
		month = FlexyUtils.getQueryStringProperty('month');

		if (year && month) {
			currDate = moment({year: year, month: month, day: 1});
		} else {
			currDate = moment();
		}		

		return {
			currentDate: currDate,
			currentMonthName: currDate.lang(constants.defaultMomentLanguage).format(constants.calendarMonthFormat),
			days: FlexyUtils.generateDatesArray(currDate.year(), currDate.month()),
			isEditing: false,
			isAuthenticated: false
		};	
	},
	render: function () {
		if (!this.state.isAuthenticated) {
			return ( 
				React.createElement("div", null, 
					React.createElement(FlexyAuth, {onUserAuthenticated: this.userAuthenticated})
				));
		} else {
			return (
				React.createElement("div", null, 
					React.createElement(CurrentMonthBar, {monthName: this.state.currentMonthName, onChangeMonth: this.changeMonth}), 
					React.createElement(WeekHeadersBar, null), 
					React.createElement(DaysContainer, {days: this.state.days, onOpenEdit: this.openDayEditPanel}), 				
					React.createElement(EditPanel, {isEditing: this.state.isEditing, onCloseEditPanel: this.closeEditPanel, editDay: this.state.editDay})
				));
		}
	}
});

React.render(
  React.createElement(FlexyCalendar, null),
  document.getElementById('content')
);

//<DaysContainer days={this.state.days} key={this.state.currentDate.format(constants.calendarMonthFormat)} />