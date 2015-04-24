var MonthNavButton = React.createClass({displayName: "MonthNavButton",
	render: function () {
		return (React.createElement("button", {className: "{this.props.className}"}, this.props.text));
	}
});

var CurrentMonthBar = React.createClass({displayName: "CurrentMonthBar",
	render: function () {
		return (
			React.createElement("nav", {className: "month-bar"}, 
				React.createElement(MonthNavButton, {className: "prev-month", text: "Prev"}), 
				React.createElement("h3", {className: "selected-month"}, "April"), 
				React.createElement(MonthNavButton, {className: "next-month", text: "Next"})
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

var DaysContainer = React.createClass({displayName: "DaysContainer",
	getInitialState: function () {
		var today = moment(),
			daysInMonth = today.daysInMonth(),
			days = [],
			firstOfMonth = moment().days(1),
			lastOfMonth = moment().days(daysInMonth),
			currDay = moment(firstOfMonth).subtract(1, 'days');

			for (var i = firstOfMonth.weekday(); i > 0; i--) {				
				days.push({ 
					shortDate: currDay.date(),
					longDate: currDay.format('DD.MM.YYYY')
				});
				currDay.subtract(1, 'days');
			};

			var longDateTail = today.format('.MM.YYYY');
			for (var i = 1; i <= today.daysInMonth(); i++) {
				days.push({ 
					shortDate: i,
					longDate: i + longDateTail
				});
			};


			var nextMonth = moment(lastOfMonth).add(1, 'days');

			longDateTail = nextMonth.format('.MM.YYYY');
			for (var i = 1, count = 7 - lastOfMonth.weekday(); i <= count ; i++) {
				days.push({ 
					shortDate: i,
					longDate: i + longDateTail
				});
			};

		return {
			currentMonth: d.format('MMMM'),
			days: days
		};	
	},
	render: function () {
		return (React.createElement("ul", {className: "days-container flex-container"}, 
					React.createElement("li", {className: "outside-month"}, "29"), 
					React.createElement("li", {className: "outside-month"}, "30"), 
					React.createElement("li", {className: "outside-month"}, "31"), 
					React.createElement("li", null, "1"), 
					React.createElement("li", null, "2"), 
					React.createElement("li", null, "3"), 
					React.createElement("li", null, "4"), 
					React.createElement("li", null, "5"), 
					React.createElement("li", null, "6"), 
					React.createElement("li", null, "7"), 
					React.createElement("li", null, "8"), 
					React.createElement("li", null, "9"), 
					React.createElement("li", null, "10"), 
					React.createElement("li", null, "11"), 
					React.createElement("li", null, "12"), 
					React.createElement("li", null, "13"), 
					React.createElement("li", null, "14"), 
					React.createElement("li", null, "15"), 
					React.createElement("li", null, "16"), 
					React.createElement("li", null, "17"), 
					React.createElement("li", null, "18"), 
					React.createElement("li", null, "19"), 
					React.createElement("li", null, "20"), 
					React.createElement("li", null, "21"), 
					React.createElement("li", null, "22"), 
					React.createElement("li", null, "23"), 
					React.createElement("li", null, "24"), 
					React.createElement("li", null, "25"), 
					React.createElement("li", null, "26"), 
					React.createElement("li", null, "27"), 
					React.createElement("li", null, "28"), 
					React.createElement("li", null, "29"), 
					React.createElement("li", null, "30"), 
					React.createElement("li", {className: "outside-month"}, "1"), 
					React.createElement("li", {className: "outside-month"}, "2")
				))
	}
});

var DaysOfMonth = React.createClass({displayName: "DaysOfMonth",
	render: function () {
		var cx = React.addons.classSet;
		var classes = cx({
			'outside-month': this.prop.isOutsideMonth
		});
		return (React.createElement("li", {className: classes}, this.prop.dayOfMonth))
	}
});

var FlexyCalendar = React.createClass({displayName: "FlexyCalendar",
	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement(CurrentMonthBar, null), 
				React.createElement(WeekHeadersBar, null), 
				React.createElement(DaysContainer, null)
			));
	}
});

React.render(
  React.createElement(FlexyCalendar, null),
  document.getElementById('content')
);