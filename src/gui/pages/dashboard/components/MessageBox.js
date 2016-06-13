/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';

import {Request} from '../../../../models/Request';
import {Response} from '../../../../models/Response';

export class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
    }

    componentDidMount() {
        this.editor = createTextEditor();
        $('.CodeMirror ').css({"background":"#fcfcfc"});
    }

    componentDidUpdate() {
        if (this.props.message == null) {
            return;
        }

        if (this.props.message.state == "RECORD") {
            this.editor.setOption("readOnly", false);
            $('.CodeMirror ').css({"background":"#ffffff", "cursor": "auto"});
        } else {
            this.editor.setOption("readOnly", true);
            $('.CodeMirror ').css({"background":"#fcfcfc", "cursor": "not-allowed"});

        }
        this.editor.setValue(this.props.message.content);
    }



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
                                {
                                    (function () {
                                        var message = this.props.message;
                                        var isResponse = Response.prototype.isPrototypeOf(this.props.message);

                                        //id, protocol, status, content, contentLength, contentType)
                                        if (message == null) {
                                            return;
                                        }

                                        if (isResponse) {
                                            return (
                                                <ul>
                                                    <li>
                                                        <div className="properties title">Protocol:</div>
                                                        <div className="properties value">{message.protocol}</div>
                                                    </li>
                                                    <li>
                                                        <div className="properties title">Status:</div>
                                                        <div className="properties value"><i class="fa fa-circle" is="null" aria-hidden="true" style={{fontSize: "7pt", color: "#7fcb1d"}}></i> {message.status}</div>
                                                    </li>
                                                    <li>
                                                        <div className="properties title">Content-Length:</div>
                                                        <div className="properties value">{message.contentLength}</div>
                                                    </li>
                                                    <li>
                                                        <div className="properties title">Content-Type:</div>
                                                        <div className="properties value">{message.contentType}</div>
                                                    </li>
                                                </ul>
                                            )
                                        } else {
                                            //(id, protocol, method, uri, content, matchType, matchString)
                                            return (
                                                <ul>
                                                    <li>
                                                        <div className="properties title">Protocol:</div>
                                                        <div className="properties value">{message.protocol}</div>
                                                    </li>
                                                    <li>
                                                        <div className="properties title">Method:</div>
                                                        <div className="properties value">{message.method}</div>
                                                    </li>
                                                    <li>
                                                        <div className="properties title">URI:</div>
                                                        <div className="properties value">{message.uri}</div>
                                                    </li>
                                                    <li>
                                                        <div className="properties title">Match Type:</div>
                                                        <div className="properties value">{message.matchType}</div>
                                                    </li>
                                                    <li>
                                                        <div className="properties title">Match String:</div>
                                                        <div className="properties value">{message.matchString}</div>
                                                    </li>
                                                </ul>
                                            )
                                        }

                                    }.bind(this))()
                                }
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

var createTextEditor = function() {
    var mixedMode = {
        name: "htmlmixed",
        scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
            mode: null},
            {matches: /(text|application)\/(x-)?vb(a|script)/i,
                mode: "vbscript"}]
    };

    CodeMirror.defineMode("xmlAndJsonMode", function(config, parserConfig) {
        return CodeMirror.overlayMode(CodeMirror.getMode(config, "application/ld+json"), CodeMirror.getMode(config, "application/xml"));
    });

    var editor = CodeMirror.fromTextArea(document.getElementById("content"), {
        matchBrackets: true,
        autoCloseBrackets: true,

        lineWrapping: false,
        lineNumbers: true,
        mode: "xmlAndJsonMode",
        fixedGutter: true,
    });
    return editor;
}