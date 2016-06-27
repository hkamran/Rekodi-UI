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
            message: null,
            dirty: false,
            newKey: false
        }
        this.dom = {};
    }

    componentDidMount() {
        this.editor = createTextEditor();
        this.dom.editor = $('.CodeMirror ');
        this.clear();
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.message == null) {
            this.clear();
            return;
        }

        var message = nextProps.message.clone();
        this.setDirty(false);
        this.setMessage(message);
    }

    componentDidUpdate() {
        var message = this.state.message;

        if (!(message instanceof Response || message instanceof Request)) {
            return;
        }

        if (State.cmp(message.state, State.RECORD)) {
            this.editor.setOption("readOnly", false);
            this.dom.editor.css({"background":"#ffffff", "cursor": "auto"});
        } else {
            this.editor.setOption("readOnly", true);
            this.dom.editor.css({"background":"#fcfcfc", "cursor": "not-allowed"});
        }

        if (this.state.newKey) {
            var inputElem = ReactDOM.findDOMNode(this.refs.newKey);
            inputElem.focus();
        }

        this.editor.setValue(message.content);
    }

    clear() {
        this.state.message = null;
        this.editor.setValue("");
        this.editor.setOption("readOnly", true);
        this.dom.editor.css({"background":"#fcfcfc", "cursor": "not-allowed"});
    }

    dataChangeResponse(data) {
        if (typeof data.protocol !== 'undefined') {
            this.state.message.protocol = data.protocol;
        } else if (typeof data.status !== 'undefined') {
            this.state.message.status = parseInt(data.status);
        }

        this.setDirty(true);
    }

    dataChangeRequest(data) {
        if (typeof data.protocol !== 'undefined') {
            this.state.message.protocol = data.protocol;
        } else if (typeof data.method !== 'undefined') {
            this.state.message.method = data.method;
        } else if (typeof data.uri !== 'undefined') {
            this.state.message.uri = data.uri;
        }

        this.setDirty(true);
    }

    dataChangeHeaderValue(data) {
        Object.keys(data).map(function (key, i) {
            this.state.message.headers[key] = data[key];
        }.bind(this));

        this.setDirty(true);
    }

    dataChangeHeaderKey(data) {
        Object.keys(data).map(function (key, i) {
            var newKey = data[key];
            var oldKey = key;

            var value = this.state.message.headers[oldKey];
            this.dataDeleteHeaderKey(key);

            if (!(typeof newKey === 'undefined' || newKey.length == 0)) {
                this.state.message.headers[newKey] = value;
            }

        }.bind(this));

        this.setDirty(true);
    }

    dataDeleteHeaderKey(key) {
        delete this.state.message.headers[key];
        this.setMessage(this.state.message);
    }

    setMessage(message) {
        this.setState({
            message: message
        });
    }

    setDirty(flag) {
        this.setState({
            dirty: flag
        });
    }


    editingNewHeaderFinished() {
        var inputElem = ReactDOM.findDOMNode(this.refs.newKey);
        var value = inputElem.value;

        this.setState({
            newKey: false
        })
        if (typeof value === 'undefined' || value.length == 0) {
            return;
        } else {
            this.state.message.headers[value] = " ";
            this.setMessage(this.state.message);
            inputElem.value = "";
        }
    }

    editingNewHeaderShow() {
        this.setState({
            newKey: true
        })
    }

    editingNewHeaderKey(event) {
        if (event.keyCode ===  13) {
            this.editingNewHeaderFinished();
        } else if (event.keyCode === 27) {
            this.setState({
                newKey: false
            })
        }
    }

    render() {

        return (

            <div id="messageContainer" className="box">

                <div className="header">
                    <div className="item left border">Message</div>

                    <div className="item right border"><i className="fa fa-code" aria-hidden="true" /></div>
                    <div className="item right border" onClick={this.props.updateMessageHandler.bind(this, this.state.message, this.editor)} ><i className="fa fa-floppy-o" aria-hidden="true" /></div>

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
                                                                    if (message.status < 200) {
                                                                        color = "#dedede";
                                                                    } else if (message.status < 300) {
                                                                        color = "#7fcb1d";
                                                                    } else if (message.status < 400) {
                                                                        color = "#3383ff";
                                                                    } else if (message.status < 500) {
                                                                        color = "#e67e22 ";
                                                                    } else {
                                                                        color = "#cd3737";
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
                                                        Object.keys(message.headers).sort().map(function (key, i) {
                                                            return (
                                                                <li key={i}>
                                                                    <div className="properties close" onClick={this.dataDeleteHeaderKey.bind(this, key)}><i className="fa fa-times" /></div>
                                                                    <div className="properties title" style={{cursor: "text"}}>
                                                                        <InlineEdit
                                                                            activeClassName="editing"
                                                                            text={key}
                                                                            paramName={key}
                                                                            change={this.dataChangeHeaderKey.bind(this)}
                                                                            minLength={0}
                                                                        />:
                                                                    </div>
                                                                    <div className="properties value" style={{cursor: "text"}}>
                                                                        <InlineEdit
                                                                            className="name"
                                                                            activeClassName="editing"
                                                                            text={message.headers[key] + ""}
                                                                            paramName={key}
                                                                            minLength={0}
                                                                            change={this.dataChangeHeaderValue.bind(this)}
                                                                        />
                                                                    </div>
                                                                </li>
                                                            )
                                                        }.bind(this))
                                                    }
                                                    <li style={{display: (this.state.newKey ? "block" : "none")}}>
                                                        <div className="properties title" style={{cursor: "text"}}>
                                                            <input ref="newKey" className="editing"
                                                                   onBlur={this.editingNewHeaderFinished.bind(this)}
                                                                   onKeyDown={this.editingNewHeaderKey.bind(this)}
                                                                   onReturn={this.editingNewHeaderFinished.bind(this)}
                                                            />:
                                                        </div>
                                                        <div className="properties value" style={{cursor: "text"}}></div>
                                                    </li>
                                                    <li>
                                                        <div className="properties add" onClick={this.editingNewHeaderShow.bind(this)}></div>
                                                    </li>
                                                </ul>
                                            )
                                        } else if (message instanceof Request) {
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
                                                    <li>
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
                                                        Object.keys(message.headers).sort().map(function (key, i) {
                                                            if (i == 0) {
                                                                var style = {
                                                                    paddingTop: "10px"
                                                                };
                                                            }
                                                            return (
                                                                <li key={i} style={style}>
                                                                    <div className="properties close" onClick={this.dataDeleteHeaderKey.bind(this, key)}><i className="fa fa-times" /></div>
                                                                    <div className="properties title" style={{cursor: "text"}}>
                                                                        <InlineEdit
                                                                            activeClassName="editing"
                                                                            text={key}
                                                                            paramName={key}
                                                                            change={this.dataChangeHeaderKey.bind(this)}
                                                                            minLength={0}
                                                                        />:
                                                                    </div>
                                                                    <div className="properties value" style={{cursor: "text"}}>
                                                                        <InlineEdit
                                                                            className="name"
                                                                            activeClassName="editing"
                                                                            text={message.headers[key] + ""}
                                                                            paramName={key}
                                                                            minLength={0}
                                                                            change={this.dataChangeHeaderValue.bind(this)}
                                                                        />
                                                                    </div>
                                                                </li>
                                                            )
                                                        }.bind(this))
                                                    }
                                                    <li style={{display: (this.state.newKey ? "block" : "none")}}>
                                                        <div className="properties title" style={{cursor: "text"}}>
                                                            <input ref="newKey" className="editing"
                                                                   onBlur={this.editingNewHeaderFinished.bind(this)}
                                                                   onKeyDown={this.editingNewHeaderKey.bind(this)}

                                                            />:
                                                        </div>
                                                        <div className="properties value" style={{cursor: "text"}}></div>
                                                    </li>
                                                    <li>
                                                        <div className="properties add" onClick={this.editingNewHeaderShow.bind(this)}></div>
                                                    </li>
                                                    <li>
                                                        <div className="properties title" style={{cursor: "not-allowed"}}>Match Type:</div>
                                                        <div className="properties value">{message.matchType}</div>
                                                    </li>
                                                    <li>
                                                        <div className="properties title" style={{cursor: "not-allowed"}}>Match String:</div>
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