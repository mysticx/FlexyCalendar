var constants = {
	calendarMonthFormat: 'MMMM, YYYY',
	defaultMomentLanguage: 'en'
}

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
	Button = window.ReactBootstrap.Button,
	Glyphicon = window.ReactBootstrap.Glyphicon,
	Input = window.ReactBootstrap.Input
	Alert = window.ReactBootstrap.Alert;

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
7	}
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
	showEditPanel: function () {
		this.props.onOpenEdit(this.props.longDate);
	},
	render: function () {
		var cx = React.addons.classSet;
		var classes = cx({
			'outside-month': this.props.isOutsideMonth
		});
		return (<li className={classes} data-longDate={this.props.longDate}>
					{this.props.shortDate} 
					<div className="day-edit-bar">						
						<button className="flat-button" onClick={this.showEditPanel}>
							<Glyphicon glyph="pencil" />						
						</button>

						<button className="flat-button">
							<Glyphicon glyph="trash" />
						</button>

						<button className="flat-button">
							<Glyphicon glyph="star" />
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
								isOutsideMonth={days[i].isOutsideMonth} 
								onOpenEdit={this.props.onOpenEdit}
								/>)
		};

		return React.DOM.ul({className:"days-container flex-container"}, displayDays);

		return (
			<ul className="days-container flex-container">
				{displayDays}
			</ul>);
	}
});

var EditPanel = React.createClass({
	render: function () {
		var cx = React.addons.classSet;
		var classes = cx({
			'animateIn': this.props.isEditing,
			'editPanel': true
		});

		var mEditDay = moment(this.props.editDay, 'DD.MM.YYYY');

		return (<div className={classes}>
					<button onClick={this.props.onCloseEditPanel} className="flat-button close-panel-button">  
						<Glyphicon glyph='remove' />
					</button>
					<h2 className="edit-panel-heading">Events for {mEditDay.lang(constants.defaultMomentLanguage).format('dddd, DD.MM.YYYY')}</h2>

				</div>);
	}
});

var FlexyCalendar = React.createClass({
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
				<div>
					<FlexyAuth onUserAuthenticated={this.userAuthenticated} />
				</div>);
		} else {
			return (
				<div>
					<CurrentMonthBar monthName={this.state.currentMonthName} onChangeMonth={this.changeMonth} />
					<WeekHeadersBar />
					<DaysContainer days={this.state.days} onOpenEdit={this.openDayEditPanel}/>				
					<EditPanel isEditing={this.state.isEditing} onCloseEditPanel={this.closeEditPanel} editDay={this.state.editDay} />
				</div>);
		}
	}
});

React.render(
  <FlexyCalendar />,
  document.getElementById('content')
);

//<DaysContainer days={this.state.days} key={this.state.currentDate.format(constants.calendarMonthFormat)} />