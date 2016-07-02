/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import {Request} from '../../../../models/Request';
import {Response} from '../../../../models/Response';

export class EventBox extends React.Component {


    componentDidUpdate() {
        this.autoScroll();

    }

    autoScroll() {
        var element = document.getElementById("eventContent");
        element.scrollTop = element.scrollHeight + 20;
    }

    render() {

        return (
            <div id="eventsContainer" style={{height: "calc(50% - 5px)"}} className="box">
                <div className="header">
                    <div className="item left border">Events</div>
                    <div className="item right border"><i className="fa fa-eraser" aria-hidden="true"></i></div>
                </div>
                <div className="body min">
                    <div  className="column grow width">
                        <div id="eventWrapper" className="content max" >
                            <table id="eventTable" cellPadding ="8" cellSpacing ="0" style={{height: "100%"}}>
                                <thead>
                                <tr>
                                    <th style={{width: "1%", minWidth: "70px"}}>Time</th>
                                    <th style={{width: "50%"}}>Description</th>
                                    <th style={{width: "1%", minWidth: "120px"}}>Request</th>
                                    <th style={{width: "1%", minWidth: "120px"}}>Response</th>
                                    <th style={{width: "1%", minWidth: "117px", borderRight: "0px"}}>Duration</th>
                                </tr>
                                </thead>
                                <TransitionGroup id="eventContent" component="tbody" transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                                    {

                                        Object.keys(this.props.events).sort().map(function(id, i, props) {
                                            var event = this.props.events[id];
                                            var request = event.request;
                                            var response = event.response;

                                            return (
                                                <tr key={i} style={{height: "1%"}}>
                                                    <td style={{width: "1%", minWidth: "70px"}}>{event.startTime}</td>
                                                    <td style={{width: "50%"}}>Incoming Request: <span className="http method">{request.method}</span> <span className="http uri">{request.uri}</span></td>
                                                    <td style={{width: "1%", minWidth: "120px"}}>
                                                        <span onClick={this.props.setMessageHandler.bind(this, request)} className="http label button">
                                                            {request.id}
                                                        </span>
                                                    </td>
                                                    <td style={{width: "1%", minWidth: "120px"}}>
                                                        {(function() {
                                                            if (response != null) {

                                                                return (
                                                                    <span onClick={this.props.setMessageHandler.bind(this, response)} className="http label button">
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
                                                    <td style={{width: "1%", minWidth: "100px", maxWidth: "100px"}}>{event.duration}ms</td>
                                                </tr>

                                            )
                                        }, this)
                                    }

                                </TransitionGroup>
                            </table>


                        </div>
                    </div>
                </div>
                <div className="footer" ></div>
            </div>
        )
    }
}