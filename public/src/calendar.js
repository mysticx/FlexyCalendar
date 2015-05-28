
var Link = window.ReactRouter.Link,
    CollapsibleMixin = window.ReactBootstrap.CollapsableMixin,
    Button = window.ReactBootstrap.Button,
    ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
    Glyphicon = window.ReactBootstrap.Glyphicon;

var constants = {
    calendarMonthFormat: 'MMMM, YYYY',
    defaultMomentLanguage: 'en'
}


var CurrentMonthBar = React.createClass({
    render: function () {
        var urlValues = window.location.pathname.split('/'),
            currDate;
        if (urlValues.length > 2) {
            currDate = moment({year: urlValues[2], month: urlValues[3], day: 1});
        } else {
            currDate = moment();
        }      
        
        var prevMonthUrl = '/calendar' + currDate.month(currDate.month() - 2).format('/YYYY/M'),
        nextMonthUrl = '/calendar' + currDate.month(currDate.month() + 2).format('/YYYY/M');
    
        return (
            <nav className="month-bar">
                <Link to={prevMonthUrl} className={'prev-month'}>Prev</Link>                
                <h3 className="selected-month">{this.props.monthName}</h3>
                <Link to={nextMonthUrl} className={'next-month'}>Next</Link>                
            </nav>
        );
7   }
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
        return (<li className={classes} data-long_date={this.props.longDate}>
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

var CollapsibleEvent = React.createClass({
    mixins: [CollapsibleMixin],

    getCollapsableDOMNode: function (){
        return React.findDOMNode(this.refs.eventDataPanel);
    },

    getCollapsableDimensionValue: function (){
        return React.findDOMNode(this.refs.eventDataPanel).scrollHeight;
    },

    onHandleToggle: function (e){
        e.preventDefault();
        this.setState({expanded:!this.state.expanded});
    },

    render: function (){
        var styles = this.getCollapsableClassSet();
        var toggleGlyph = this.isExpanded() ? 'triangle-top' : 'triangle-bottom';
        var classNames = React.addons.classSet(styles);

        return (
            <li>
                <div>
                    <div className="event-panel-header">
                        <a onClick={this.onHandleToggle} className="flat-button toggle-button">
                            <Glyphicon glyph={toggleGlyph} />
                        </a>
                        <h4>{this.props.eventData.name}</h4>
                    </div>
                    <div ref='eventDataPanel' className={classNames}>                        
                        <div className="left-panel">
                            <img  className="edit-event-picture" src={this.props.eventData.imageUrl} />
                        </div>
                        <div className="right-panel">
                            <p>{this.props.eventData.description}</p>
                            

                        </div>
                    </div>
                </div>
            </li>
        );
    }
});

var EditPanel = React.createClass({
    addEvent: function () {
        
    },
    render: function () {
        var cx = React.addons.classSet;
        var classes = cx({
            'animateIn': this.props.isEditing,
            'editPanel': true
        });

        var mEditDay = moment(this.props.editDay, 'DD.MM.YYYY'),
            eventData = [
                {
                    name: 'Test name 1', 
                    description: 'Test description 1', 
                    imageUrl: ''
                }, {
                    name: 'Test name 2', 
                    description: 'Test description 2', 
                    imageUrl: ''
                }];    

        var events = [];
        for (var i = 0; i < eventData.length; i++) {
            events.push(<CollapsibleEvent eventData={eventData[i]} />);
        };



        return (<div className={classes}>
                    <button onClick={this.props.onCloseEditPanel} className="flat-button close-panel-button">  
                        <Glyphicon glyph='remove' />
                    </button>
                    <h2 className="edit-panel-heading">Events for {mEditDay.lang(constants.defaultMomentLanguage).format('dddd, DD.MM.YYYY')}</h2>

                    <button onClick={this.addEvent} className="add-new-event flat-button" title="Add new event">
                        <Glyphicon glyph='plus' />
                    </button>
                    <ul className="events-list">
                        {events}
                    </ul>
                </div>);
    }
});

var Calendar = React.createClass({
    createStateByPathDate: function () {
        var currDate,
        year = this.context.router.getCurrentParams().year,
        month = this.context.router.getCurrentParams().month;

        if (year && month) {
            currDate = moment({year: year, month: month, day: 1});
        } else {
            currDate = moment();
        }

        return {
            currentDate: currDate,
            currentMonthName: currDate.lang(constants.defaultMomentLanguage).format(constants.calendarMonthFormat),
            days: FlexyUtils.generateDatesArray(currDate.year(), currDate.month()),
            isEditing: false
        };
    },
    contextTypes: {
        router: React.PropTypes.func
    },
    componentWillReceiveProps: function () {
        this.setState(this.createStateByPathDate());
    },
    getQueryState: function () {
        var date = this.state.currentDate;

        return {
            year: date.year(),
            month: date.month()
        };
    },
    openDayEditPanel: function (editDay) {
        if (this.state.editDay === editDay && this.state.isEditing) {
            this.setState({isEditing: false});
        } else {
            this.setState({
                isEditing: true,
                editDay: editDay
            });
        }       
    },
    closeEditPanel: function () {
        this.setState({isEditing: false});  
    },
    getInitialState: function () {
        return this.createStateByPathDate();
    },
    render: function () {

        return (
            <div>
                <CurrentMonthBar monthName={this.state.currentMonthName} />
                <WeekHeadersBar />
                <DaysContainer days={this.state.days} onOpenEdit={this.openDayEditPanel}/>              
                <EditPanel isEditing={this.state.isEditing} onCloseEditPanel={this.closeEditPanel} editDay={this.state.editDay} />              
            </div>);
    }
});