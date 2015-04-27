var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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
	}
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
	render: function () {
		var cx = React.addons.classSet;
		var classes = cx({
			'outside-month': this.props.isOutsideMonth
		});
		return (React.createElement("li", {className: classes, "data-longDate": this.props.longDate}, 
					this.props.shortDate, 
					React.createElement("div", {className: "day-edit-bar"}, 
						React.createElement("button", {className: "day-editbar-button"}, 
							React.createElement("span", {className: "glyphicon glyphicon-pencil"})						
						), 

						React.createElement("button", {className: "day-editbar-button"}, 
							React.createElement("span", {className: "glyphicon glyphicon-trash"})	
						), 

						React.createElement("button", {className: "day-editbar-button"}, 
							React.createElement("span", {className: "glyphicon glyphicon-star"})	
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
								isOutsideMonth: days[i].isOutsideMonth}))
		};


		return React.DOM.ul({className:"days-container flex-container"}, displayDays);
	}
});

var FlexyCalendar = React.createClass({displayName: "FlexyCalendar",
	constants: {
		calendarMonthFormat: 'MMMM, YYYY',
		defaultMomentLanguage: 'en'
	},
	generateDatesArray: function (year, month) {		
		var currDate = moment({year: year, month: month, day: 1}),
			daysInMonth = currDate.daysInMonth(),
			days = [],
			firstOfMonth = moment(currDate), //copy from currDate
			lastOfMonth = moment(currDate).date(daysInMonth),
			currDay = moment(firstOfMonth).subtract(1, 'days');

		// get the days in the first week from the previous month
		for (var i = firstOfMonth.weekday(); i > 0; i--) {				
			days.unshift({ 
				shortDate: currDay.date(),
				longDate: currDay.format('DD.MM.YYYY'),
				isOutsideMonth: true
			});
			currDay.subtract(1, 'days');
		};

		// get the current month's days
		var longDateTail = currDate.format('.MM.YYYY');
		for (var i = 1; i <= currDate.daysInMonth(); i++) {
			days.push({ 
				shortDate: i,
				longDate: i + longDateTail,
				isOutsideMonth: false
			});
		};

		// get the days from the next month in the last week
		var nextMonth = moment(lastOfMonth).add(1, 'days'),
			longDateTail = nextMonth.format('.MM.YYYY'),
			weekday = lastOfMonth.weekday() === 6 ? -1 : lastOfMonth.weekday();
		for (var i = 1, count = 7 - weekday; i < count ; i++) {
			days.push({ 
				shortDate: i,
				longDate: i + longDateTail,
				isOutsideMonth: true
			});
		};

		return days;
	},
	changeMonth: function (offset) {
		var currDate = this.state.currentDate.add(offset, 'month');

		this.setState({
			currentDate: currDate,
			currentMonthName: currDate.lang(this.constants.defaultMomentLanguage).format(this.constants.calendarMonthFormat),
			days: this.generateDatesArray(currDate.year(), currDate.month())
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
			currentMonthName: currDate.lang(this.constants.defaultMomentLanguage).format(this.constants.calendarMonthFormat),
			days: this.generateDatesArray(currDate.year(), currDate.month())
		};	
	},
	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement(CurrentMonthBar, {monthName: this.state.currentMonthName, onChangeMonth: this.changeMonth}), 
				React.createElement(WeekHeadersBar, null), 
				React.createElement(ReactCSSTransitionGroup, {transitionName: "example"}, 					
					React.createElement(DaysContainer, {days: this.state.days, key: "test"})
				)
			));
	}
});

React.render(
  React.createElement(FlexyCalendar, null),
  document.getElementById('content')
);

//<DaysContainer days={this.state.days} key={this.state.currentDate.format(this.constants.calendarMonthFormat)} />