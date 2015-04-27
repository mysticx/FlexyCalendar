var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var MonthNavButton = React.createClass({
	changeMonth: function () {
		if (this.props.className === 'prev-month') {
			this.props.onChangeMonth(-1);
		} else if (this.props.className === 'next-month') {
			this.props.onChangeMonth(1);
		};
	},	
	render: function () {
		return (<button onClick={this.changeMonth} className="{this.props.className}">{this.props.text}</button>);
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
					<li>Su</li>
					<li>Mo</li>
					<li>Tu</li>
					<li>We</li>
					<li>Th</li>
					<li>Fr</li>
					<li>Sa</li>
				</ul>);
	}
});


var DaysOfMonth = React.createClass({
	render: function () {
		var cx = React.addons.classSet;
		var classes = cx({
			'outside-month': this.props.isOutsideMonth
		});
		return (<li className={classes} data-longDate={this.props.longDate}>
					{this.props.shortDate} 
					<div className="day-edit-bar">
						<button className="day-editbar-button">
							<span className="glyphicon glyphicon-pencil"></span>						
						</button>

						<button className="day-editbar-button">
							<span className="glyphicon glyphicon-trash"></span>	
						</button>

						<button className="day-editbar-button">
							<span className="glyphicon glyphicon-star"></span>	
						</button>						
					</div>
				</li>)
	}
});

var DaysContainer = React.createClass({
	componentWillMount: function () {
		$('#content').removeClass('animations-on');
	},
	componentDidMount: function () {
		$('#content').addClass('animations-on');
	},
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
			<div>
				<CurrentMonthBar monthName={this.state.currentMonthName} onChangeMonth={this.changeMonth} />
				<WeekHeadersBar />
				<ReactCSSTransitionGroup transitionName="example">					
					<DaysContainer days={this.state.days} key={"test"} />
				</ReactCSSTransitionGroup>
			</div>);
	}
});

React.render(
  <FlexyCalendar />,
  document.getElementById('content')
);

//<DaysContainer days={this.state.days} key={this.state.currentDate.format(this.constants.calendarMonthFormat)} />