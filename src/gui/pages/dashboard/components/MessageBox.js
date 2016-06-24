/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';
import InlineEdit from 'react-edit-inline';

import {Request} from '../../../../models/Request';
import {Response} from '../../../../models/Response';
import {Event, State} from '../../../../models/Event';

export class MessageBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            message: props.message.clone(),
            dirty: false
        }
        this.dom = {};
    }

    componentDidMount() {
        this.editor = createTextEditor();
        this.dom.editor = $('.CodeMirror ');
        this.dom.editor.css({"background":"#fcfcfc"});
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.message == null) {
            return;
        }

        var message = nextProps.message.clone();
        this.setDirty(false);
        this.setMessage(message);
    }

    componentDidUpdate() {
        var message = this.state.message;

        if (message.state.equals(State.RECORD)) {
            this.editor.setOption("readOnly", false);
            this.dom.editor.css({"background":"#ffffff", "cursor": "auto"});
        } else {
            this.editor.setOption("readOnly", true);
            this.dom.editor.css({"background":"#fcfcfc", "cursor": "not-allowed"});
        }

        this.editor.setValue(message.content);
    }

    dataChangeResponse(data) {
        if (typeof data.protocol !== 'undefined') {
            this.state.message.protocol = data.protocol;
        } else if (typeof data.status !== 'undefined') {
            this.state.message.status = parseInt(data.status);
        }

        this.setMessage(this.state.message);
        this.setDirty(true);
    }

    dataChangeRequest(data) {
        if (typeof data.protocol !== 'undefined') {
            this.state.message.protocol = data.protocol;
        } else if (typeof data.method !== 'undefined') {
            this.state.message.method = parseInt(data.method);
        } else if (typeof data.uri !== 'undefined') {
            this.state.message.uri = parseInt(data.uri);
        }

        this.setMessage(this.state.message);
        this.setDirty(true);
    }

    dataChangeHeaderValue(data) {
        Object.keys(data).map(function (key, i) {
            this.state.message.headers[key] = data[key];
        }.bind(this));
        this.setMessage(this.state.message);
        this.setDirty(true);
    }

    dataChangeHeaderKey(data) {
        Object.keys(data).map(function (key, i) {
            var newKey = data[key];
            var oldKey = key;

            var value = this.state.message.headers[oldKey];

            delete this.state.message.headers[oldKey];

            this.state.message.headers[newKey] = value;
        }.bind(this));
        this.setMessage(this.state.message);
        this.setDirty(true);
    }

    setMessage(message) {
        console.log(message);
        this.setState({
            message: message
        });
    }

    setDirty(flag) {
        this.setState({
            dirty: flag
        });
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
                                        var message = this.state.message;
                                        if (message == null) {
                                            return;
                                        }

                                        if (message instanceof Response) {
                                            //id, protocol, status, content, contentLength, contentType)
                                            return (
                                                <ul>
                                                    <li>
                                                        <div className="properties title" style={{cursor: "not-allowed"}}>Protocol:</div>
                                                        <div className="properties value" style={{cursor: "text"}}>
                                                            <InlineEdit
                                                                activeClassName="editing"
                                                                text={message.protocol}
                                                                paramName="protocol"
                                                                change={this.dataChangeResponse.bind(this)}
                                                            />
                                                        </div>
                                                    </li>
                                                    <li style={{paddingBottom: "10px"}}>
                                                        <div className="properties title" style={{cursor: "not-allowed"}}>Status:</div>
                                                        <div className="properties value" style={{cursor: "text"}}>
                                                            {
                                                                (function() {
                                                                    var color;
                                                                    if (message.status == 100) {
                                                                        color = "#dedede";
                                                                    } else {
                                                                        color = "#7fcb1d";
                                                                    }

                                                                    return (
                                                                        <i class="fa fa-circle" is="null" aria-hidden="true" style={{fontSize: "7pt", color: color, marginRight: "5px"}} />
                                                                    )
                                                                }.bind(this))()
                                                            }

                                                            <InlineEdit
                                                                activeClassName="editing"
                                                                text={message.status + ""}
                                                                paramName="status"
                                                                change={this.dataChangeResponse.bind(this)}
                                                            />
                                                        </div>
                                                    </li>
                                                    {
                                                        Object.keys(message.headers).map(function (key, i) {
                                                            return (
                                                                <li key={i}>
                                                                    <div className="properties title" style={{cursor: "text"}}>
                                                                        <InlineEdit
                                                                            activeClassName="editing"
                                                                            text={key}
                                                                            paramName={key}
                                                                            change={this.dataChangeHeaderKey.bind(this)}
                                                                        />:
                                                                    </div>
                                                                    <div className="properties value" style={{cursor: "text"}}>
                                                                        <InlineEdit
                                                                            activeClassName="editing"
                                                                            text={message.headers[key] + ""}
                                                                            paramName={key}
                                                                            change={this.dataChangeHeaderValue.bind(this)}
                                                                        />
                                                                    </div>
                                                                </li>
                                                            )
                                                        }.bind(this))
                                                    }
                                                </ul>
                                            )
                                        } else {
                                            //(id, protocol, method, uri, content, matchType, matchString)
                                            return (
                                                <ul>
                                                    <li>
                                                        <div className="properties title" style={{cursor: "not-allowed"}}>Protocol:</div>
                                                        <div className="properties value" style={{cursor: "text"}}>
                                                            <InlineEdit
                                                                activeClassName="editing"
                                                                text={message.protocol}
                                                                paramName="protocol"
                                                                change={this.dataChangeRequest.bind(this)}
                                                            />
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="properties title" style={{cursor: "not-allowed"}}>Method:</div>
                                                        <div className="properties value" style={{cursor: "text"}}>
                                                            <InlineEdit
                                                                activeClassName="editing"
                                                                text={message.method}
                                                                paramName="method"
                                                                change={this.dataChangeRequest.bind(this)}
                                                            />
                                                        </div>
                                                    </li>
                                                    <li style={{paddingBottom: "10px"}}>
                                                        <div className="properties title" style={{cursor: "not-allowed"}}>URI:</div>
                                                        <div className="properties value" style={{cursor: "text"}}>
                                                            <InlineEdit
                                                                activeClassName="editing"
                                                                text={message.uri}
                                                                paramName="uri"
                                                                change={this.dataChangeRequest.bind(this)}
                                                            />
                                                        </div>
                                                    </li>
                                                    {
                                                        Object.keys(message.headers).map(function (key, i) {
                                                            return (
                                                                <li key={i}>
                                                                    <div className="properties title" style={{cursor: "text"}}>
                                                                        <InlineEdit
                                                                            activeClassName="editing"
                                                                            text={key}
                                                                            paramName={key}
                                                                            change={this.dataChangeHeaderKey.bind(this)}
                                                                        />:
                                                                    </div>
                                                                    <div className="properties value" style={{cursor: "text"}}>
                                                                        <InlineEdit
                                                                            activeClassName="editing"
                                                                            text={message.headers[key] + ""}
                                                                            paramName={key}
                                                                            change={this.dataChangeHeaderValue.bind(this)}
                                                                        />
                                                                    </div>
                                                                </li>
                                                            )
                                                        }.bind(this))
                                                    }

                                                    <li style={{paddingTop: "10px"}}>
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

MessageBox.propTypes = {
    message: React.PropTypes.object.isRequired
};

MessageBox.defaultProps = {
    message: new Response(-1, "", 100, "", {}, State.valueOf("PROXY"), "")
};


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