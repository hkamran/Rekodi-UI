/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';
import TransitionGroup from 'react-addons-css-transition-group';

import {Request} from '../../../../../models/Request';
import {Response} from '../../../../../models/Response';
import {EventRow} from './components/EventRow';

export class EventBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            autoScroll : false
        }
    }

    componentDidMount() {
        this.eventScrollBar = document.getElementById("tBodyContainer");
    }

    componentWillReceiveProps(nextProps){
        var isAtBottom = this.isScrollAtBottom();
        this.setAutoScroll(isAtBottom);
    }

    componentDidUpdate() {
        if (this.state.autoScroll) {
            this.scrollToBottom();
        }
    }

    scrollToBottom() {
        this.eventScrollBar.scrollTop = this.eventScrollBar.scrollHeight;
    }

    isScrollAtBottom() {
        if (typeof this.eventScrollBar === 'undefined') {
            return false;
        }

        if (this.eventScrollBar.scrollTop ===
            (this.eventScrollBar.scrollHeight - this.eventScrollBar.offsetHeight)) {
            return true;
        }

        return false;
    }

    setAutoScroll(bool) {
        this.setState({
            autoScroll : bool
        })
    }

    render() {

        return (
            <div id="eventsContainer" style={{height: "calc(50% - 5px)"}} className="box">
                <div className="header">
                    <div className="item left border">Events</div>
                    <div className="item right border" data-title="Clear Events" onClick={this.props.setEventsHandler.bind(this, {})}><i className="fa fa-eraser" aria-hidden="true" /></div>
                </div>
                <div className="body min">
                    <div  className="column grow width">
                        <div id="eventWrapper" className="content max" >
                            <div id="scrollTableContainer">
                                <div id="tHeadContainer">
                                    <table id="tHead" cellPadding ="8" cellSpacing ="0" style={{height: "100%"}}>
                                        <tr>
                                            <td>Time</td>
                                            <td>Description</td>
                                            <td>Request</td>
                                            <td>Response</td>
                                            <td>Duration</td>
                                        </tr>
                                    </table>
                                </div>
                                <div id="tBodyContainer">
                                    <table id="tBody" cellPadding ="8" cellSpacing ="0" style={{height: "100%"}}>

                                        {
                                            Object.keys(this.props.events).sort(function(a, b) {
                                                return a.id - b.id;
                                            }).map(function (id, i, props) {
                                                var event = this.props.events[id];
                                                return (
                                                    <EventRow resetMessageHandler={this.props.resetMessageHandler}
                                                              setMessageHandler={this.props.setMessageHandler}
                                                              message={this.props.message}
                                                              event={event}
                                                              key={id}>
                                                    </EventRow>
                                                )
                                            }, this)
                                        }
                                        <tr style={{height: "100%"}}>
                                            <td style={{padding: "0px"}} />
                                            <td style={{padding: "0px"}} />
                                            <td style={{padding: "0px"}} />
                                            <td style={{padding: "0px"}} />
                                            <td style={{padding: "0px"}} />
                                        </tr>
                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer" ></div>
            </div>
        )
    }
}