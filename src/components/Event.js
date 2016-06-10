/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';


export class Event extends React.Component {
    render() {
        return (
            <div id="eventsContainer" style={{height: "calc(50% - 5px)"}} className="box">
                <div className="header">
                    <div className="item left border">Events</div>
                    <div className="item right border"><i className="fa fa-eraser" aria-hidden="true"></i></div>
                </div>
                <div className="body">
                    <div  className="column grow width">
                        <div className="content max">
                            <table cellPadding ="8" cellSpacing ="0" style={{height: "100%"}}>
                                <tr>
                                    <th style={{width: "1%"}}>Time</th>
                                    <th style={{width: "50%"}}>Description</th>
                                    <th style={{width: "25%"}}>Request</th>
                                    <th style={{width: "25%"}}>Response</th>
                                    <th style={{width: "1%"}}>Duration</th>
                                </tr>
                                <tr>
                                    <td>Jill</td>
                                    <td>Smith</td>
                                    <td>50</td>
                                    <td>Smith</td>
                                    <td>50</td>
                                </tr>
                                <tr>
                                    <td>Eve</td>
                                    <td>Jackson</td>
                                    <td>94</td>
                                    <td>Jackson</td>
                                    <td>94</td>
                                </tr>
                                <tr>
                                    <td>Jill</td>
                                    <td>Smith</td>
                                    <td>50</td>
                                    <td>Smith</td>
                                    <td>50</td>
                                </tr>
                                <tr>
                                    <td>Eve</td>
                                    <td>Jackson</td>
                                    <td>94</td>
                                    <td>Jackson</td>
                                    <td>94</td>
                                </tr>
                                <tr style={{height: "100%"}}>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}