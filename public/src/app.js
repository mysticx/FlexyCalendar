var MonthNavButton = React.createClass({
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
		return (<button className="{this.props.className}">{this.props.text}</button>);
	}
});

var CurrentMonthBar = React.createClass({
	render: function () {
		return (
			<nav className="month-bar">
				<MonthNavButton className="prev-month" text="Prev" onChangeMonth={this.props.onChangeMonth} />
				<h3 className="selected-month">{this.props.monthName}</h3>
				<MonthNavButton className="next-month" text="Next" onChangeMonth={this.props.onChangeMonth} />
			</nav>
		);
	}
});

var WeekHeadersBar = React.createClass({
	render: function () {
		return (<ul className="week-headers flex-container">
					<li>Mo</li>
					<li>Tu</li>
					<li>We</li>
					<li>Th</li>
					<li>Fr</li>
					<li>Sa</li>
					<li>Su</li>
				</ul>);
	}
});


var DaysOfMonth = React.createClass({
	render: function () {
		var cx = React.addons.classSet;
		var classes = cx({
			'outside-month': this.props.isOutsideMonth
		});
		return (<li className={classes} data-longDate={this.props.longDate}>{this.props.shortDate}</li>)
	}
});

var DaysContainer = React.createClass({
	render: function () {
		var displayDays = [];
		for (var i = 0, length = this.props.days.length, days = this.props.days; i < length; i++) {
			displayDays.push(<DaysOfMonth 
								shortDate={days[i].shortDate}
								longDate={days[i].longDate}
								isOutsideMonth={days[i].isOutsideMonth} />)
		};


		return React.DOM.ul({className:"days-container flex-container"}, displayDays);
	}
});

var FlexyCalendar = React.createClass({
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
			<div>
				<CurrentMonthBar monthName={this.state.currentMonthName} onChangeMonth={this.changeMonth} />
				<WeekHeadersBar />
				<DaysContainer days={this.state.days} />
			</div>);
	}
});

React.render(
  <FlexyCalendar />,
  document.getElementById('content')
);