
var Link = window.ReactRouter.Link,
    CollapsibleMixin = window.ReactBootstrap.CollapsableMixin,
    Button = window.ReactBootstrap.Button,
    ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
    Glyphicon = window.ReactBootstrap.Glyphicon;

var constants = {
    calendarMonthFormat: 'MMMM, YYYY',
    defaultMomentLanguage: 'en'
}


var CurrentMonthBar = React.createClass({displayName: "CurrentMonthBar",
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
            React.createElement("nav", {className: "month-bar"}, 
                React.createElement(Link, {to: prevMonthUrl, className: 'prev-month'}, "Prev"), 
                React.createElement("h3", {className: "selected-month"}, this.props.monthName), 
                React.createElement(Link, {to: nextMonthUrl, className: 'next-month'}, "Next")
            )
        );
7   }
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
        return (React.createElement("li", {className: classes, "data-long_date": this.props.longDate}, 
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

var CollapsibleEvent = React.createClass({displayName: "CollapsibleEvent",
    mixins: [CollapsibleMixin],

    getCollapsableDOMNode(){
        return React.findDOMNode(this.refs.eventDataPanel);
    },

    getCollapsableDimensionValue(){
        return React.findDOMNode(this.refs.eventDataPanel).scrollHeight;
    },

    onHandleToggle(e){
        e.preventDefault();
        this.setState({expanded:!this.state.expanded});
    },

    render(){
        var styles = this.getCollapsableClassSet();
        var toggleGlyph = this.isExpanded() ? 'triangle-top' : 'triangle-bottom';
        var classNames = React.addons.classSet(styles);

        return (
            React.createElement("li", null, 
                React.createElement("div", null, 
                    React.createElement("div", {className: "event-panel-header"}, 
                        React.createElement("a", {onClick: this.onHandleToggle, className: "flat-button toggle-button"}, 
                            React.createElement(Glyphicon, {glyph: toggleGlyph})
                        ), 
                        React.createElement("h4", null, this.props.eventData.name)
                    ), 
                    React.createElement("div", {ref: "eventDataPanel", className: classNames}, 
                        React.createElement("div", {className: "left-panel"}, 
                            React.createElement("img", {className: "edit-event-picture", src: this.props.eventData.imageUrl})
                        ), 
                        React.createElement("div", {className: "right-panel"}, 
                            React.createElement("p", null, this.props.eventData.description)
                            

                        )
                    )
                )
            )
        );
    }
});

var EditPanel = React.createClass({displayName: "EditPanel",
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
            events.push(React.createElement(CollapsibleEvent, {eventData: eventData[i]}));
        };



        return (React.createElement("div", {className: classes}, 
                    React.createElement("button", {onClick: this.props.onCloseEditPanel, className: "flat-button close-panel-button"}, 
                        React.createElement(Glyphicon, {glyph: "remove"})
                    ), 
                    React.createElement("h2", {className: "edit-panel-heading"}, "Events for ", mEditDay.lang(constants.defaultMomentLanguage).format('dddd, DD.MM.YYYY')), 

                    React.createElement("button", {onClick: this.addEvent, className: "add-new-event flat-button", title: "Add new event"}, 
                        React.createElement(Glyphicon, {glyph: "plus"})
                    ), 
                    React.createElement("ul", {className: "events-list"}, 
                        events
                    )
                ));
    }
});

var Calendar = React.createClass({displayName: "Calendar",
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
            React.createElement("div", null, 
                React.createElement(CurrentMonthBar, {monthName: this.state.currentMonthName}), 
                React.createElement(WeekHeadersBar, null), 
                React.createElement(DaysContainer, {days: this.state.days, onOpenEdit: this.openDayEditPanel}), 
                React.createElement(EditPanel, {isEditing: this.state.isEditing, onCloseEditPanel: this.closeEditPanel, editDay: this.state.editDay})
            ));
    }
});