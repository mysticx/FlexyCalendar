var MonthNavButton = React.createClass({
	render: function () {
		return (<button className="{this.props.className}">{this.props.text}</button>);
	}
});

var CurrentMonthBar = React.createClass({
	render: function () {
		return (
			<nav className="month-bar">
				<MonthNavButton className="prev-month" text="Prev"/>
				<h3 className="selected-month">April</h3>
				<MonthNavButton className="next-month" text="Next"/>
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
	getInitialState: function () {
		var today = moment(),
			daysInMonth = today.daysInMonth(),
			days = [],
			firstOfMonth = moment().date(1),
			lastOfMonth = moment().date(daysInMonth),
			currDay = moment(firstOfMonth).subtract(1, 'days');

			for (var i = firstOfMonth.weekday(); i > 0; i--) {				
				days.unshift({ 
					shortDate: currDay.date(),
					longDate: currDay.format('DD.MM.YYYY'),
					isOutsideMonth: true
				});
				currDay.subtract(1, 'days');
			};

			var longDateTail = today.format('.MM.YYYY');
			for (var i = 1; i <= today.daysInMonth(); i++) {
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

		return {
			currentMonth: today.format('MMMM'),
			days: days
		};	
	},
	render: function () {
		var displayDays = [];
		for (var i = 0, length = this.state.days.length, days = this.state.days; i < length; i++) {
			displayDays.push(<DaysOfMonth 
								shortDate={days[i].shortDate}
								longDate={days[i].longDate}
								isOutsideMonth={days[i].isOutsideMonth} />)
		};


		return React.DOM.ul({className:"days-container flex-container"}, displayDays);

		// return (<ul className="days-container flex-container">
		// 			<li className="outside-month">29</li>
		// 			<li className="outside-month">30</li>
		// 			<li className="outside-month">31</li>
		// 			<li>1</li>
		// 			<li>2</li>
		// 			<li>3</li>
		// 			<li>4</li>
		// 			<li>5</li>
		// 			<li>6</li>
		// 			<li>7</li>
		// 			<li>8</li>
		// 			<li>9</li>
		// 			<li>10</li>
		// 			<li>11</li>
		// 			<li>12</li>
		// 			<li>13</li>
		// 			<li>14</li>
		// 			<li>15</li>
		// 			<li>16</li>
		// 			<li>17</li>
		// 			<li>18</li>
		// 			<li>19</li>
		// 			<li>20</li>
		// 			<li>21</li>
		// 			<li>22</li>
		// 			<li>23</li>
		// 			<li>24</li>
		// 			<li>25</li>
		// 			<li>26</li>
		// 			<li>27</li>
		// 			<li>28</li>
		// 			<li>29</li>
		// 			<li>30</li>
		// 			<li className="outside-month">1</li>
		// 			<li className="outside-month">2</li>
		// 		</ul>)
	}
});

var FlexyCalendar = React.createClass({
	render: function () {
		return (
			<div>
				<CurrentMonthBar />
				<WeekHeadersBar />
				<DaysContainer />
			</div>);
	}
});

React.render(
  <FlexyCalendar />,
  document.getElementById('content')
);