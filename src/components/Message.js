/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';


export class Message extends React.Component {
    render() {
        return (
            <div id="messageContainer" className="box">
                <div className="header">
                    <div className="item left border">Message</div>

                    <div className="item right border"><i className="fa fa-code" aria-hidden="true"></i></div>
                    <div className="item right border"><i className="fa fa-floppy-o" aria-hidden="true"></i></div>

                </div>
                <div className="body min">
                    <div id="headerContainer" className="column" style={{width: "calc(50% - 0.5px)"}}>
                        <div className="header">
                            Header
                        </div>
                        <div className="properties content">
                            <div className="properties wrapper">
                                <ul>
                                    <li>
                                        <div className="properties title">Request URL:</div>
                                        <div className="properties value">http://www.google.com</div>
                                    </li>
                                    <li>
                                        <div className="title">Request Method:</div>
                                        <div className="value">POST</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div id="messageSplitter" className="column splitter horizontal">
                        <div id="messageSplitterClickBox" style={{width: "18px", position: "relative", height: "100%", left: "-9px", zIndex: "999"}}></div>
                    </div>
                    <div id="contentContainer" className="column" style={{width: "calc(50% - 0.5px)"}}>
                        <div className="header">
                            Content
                        </div>
                        <div className="content">
                            <div style={{height: "100%", width: "100%", whiteSpace: "normal", wordBreak: "break-all", boxSizing: "border-box"}}>
                                    <textarea id="content" name="content" style={{height: "99%", width: "100%", boxSizing: "border-box", border: "0px"}}>

                                    </textarea>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="footer" ></div>
            </div>
        )
    }
}