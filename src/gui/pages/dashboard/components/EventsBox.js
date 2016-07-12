/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import {Request} from '../../../../models/Request';
import {Response} from '../../../../models/Response';

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
                    <div className="item right border" title="Clear Events" onClick={this.props.setEventsHandler.bind(this, {})}><i className="fa fa-eraser" aria-hidden="true" /></div>
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


                                    <TransitionGroup id="tBody" style={{height: "100%"}} cellSpacing="0"
                                                     component="table" transitionName="example"
                                                     transitionEnterTimeout={500}
                                                     transitionLeaveTimeout={300}>
                                        {
                                            Object.keys(this.props.events).sort().map(function (id, i, props) {
                                                var event = this.props.events[id];
                                                var request = event.request;
                                                var response = event.response;

                                                var isMessage = event.request.equals(this.props.message);

                                                return (
                                                    <tr key={i} style={{height: "1%"}}>
                                                        <td>{event.startTime}</td>
                                                        <td>Incoming Request: <span
                                                            className="http method">{request.method}</span>
                                                            <span className="http uri">{request.uri}</span>
                                                        </td>
                                                        <td>
                                                    <span
                                                        onClick={isMessage ? this.props.resetMessageHandler : this.props.setMessageHandler.bind(this, request)}
                                                        className="http label button">
                                                        {request.id}
                                                    </span>
                                                        </td>
                                                        <td>
                                                            {(function () {
                                                                if (response != null) {
                                                                    var isMessage = response.equals(this.props.message);
                                                                    return (
                                                                        <span
                                                                            onClick={isMessage ? this.props.resetMessageHandler : this.props.setMessageHandler.bind(this, response)}
                                                                            className="http label button">
                                                                {response.hashCode}
                                                            </span>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <span className="http label button">
                                                                ...
                                                            </span>
                                                                    )
                                                                }
                                                            }.bind(this))()}
                                                        </td>
                                                        <td>{event.duration}ms</td>
                                                    </tr>

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
                                    </TransitionGroup>

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