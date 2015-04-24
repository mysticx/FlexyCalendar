var MonthNavButton = React.createClass({displayName: "MonthNavButton",
	changeMonth: function () {
		if (this.props.className === 'prev-month') {
			this.props.onChangeMonth(-1);
		} else if (this.props.className === 'next-month') {
			this.props.onChangeMonth(1);
		};
	},
	componentDidMount: function() {
    	window.addEventListener('click', this.changeMonth);
  	},
  	componentWillUnmount: function() {
    	window.removeEventListener('click', this.changeMonth);
  	},	
	render: function () {
		return (React.createElement("button", {className: "{this.props.className}"}, this.props.text));
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
					React.createElement("li", null, "Mo"), 
					React.createElement("li", null, "Tu"), 
					React.createElement("li", null, "We"), 
					React.createElement("li", null, "Th"), 
					React.createElement("li", null, "Fr"), 
					React.createElement("li", null, "Sa"), 
					React.createElement("li", null, "Su")
				));
	}
});


var DaysOfMonth = React.createClass({displayName: "DaysOfMonth",
	render: function () {
		var cx = React.addons.classSet;
		var classes = cx({
			'outside-month': this.props.isOutsideMonth
		});
		return (React.createElement("li", {className: classes, "data-longDate": this.props.longDate}, this.props.shortDate))
	}
});

var DaysContainer = React.createClass({displayName: "DaysContainer",
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
		generateDatesArray: function (year, month) {		
		var currDate = moment({year: year, month: month, day: 1}),
			daysInMonth = currDate.daysInMonth(),
			days = [],
			firstOfMonth = moment(currDate), //copy from currDate
			lastOfMonth = moment(currDate).date(daysInMonth),
			currDay = moment(firstOfMonth).subtract(1, 'days');

		for (var i = firstOfMonth.weekday(); i > 0; i--) {				
			days.unshift({ 
				shortDate: currDay.date(),
				longDate: currDay.format('DD.MM.YYYY'),
				isOutsideMonth: true
			});
			currDay.subtract(1, 'days');
		};

		var longDateTail = currDate.format('.MM.YYYY');
		for (var i = 1; i <= currDate.daysInMonth(); i++) {
			days.push({ 
				shortDate: i,
				longDate: i + longDateTail,
				isOutsideMonth: false
			});
		};


		var nextMonth = moment(lastOfMonth).add(1, 'days');

		longDateTail = nextMonth.format('.MM.YYYY');
		for (var i = 1, count = 7 - lastOfMonth.weekday(); i < count ; i++) {
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
			currentMonthName: currDate.lang('en').format('MMMM'),
			days: this.generateDatesArray(currDate.year(), currDate.month())
		});
	},
	getInitialState: function () {
		var currDate = moment();

		return {
			currentDate: currDate,
			currentMonthName: currDate.lang('en').format('MMMM'),
			days: this.generateDatesArray(currDate.year(), currDate.month())
		};	
	},
	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement(CurrentMonthBar, {monthName: this.state.currentMonthName, onChangeMonth: this.changeMonth}), 
				React.createElement(WeekHeadersBar, null), 
				React.createElement(DaysContainer, {days: this.state.days})
			));
	}
});

React.render(
  React.createElement(FlexyCalendar, null),
  document.getElementById('content')
);