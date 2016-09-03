/**
 * Created by HK on 6/9/2016.
 */


import React from 'react';
import {render} from 'react-dom';
import {State} from './../models/Event';
import {Filter} from './../models/Filter';
import {Proxy} from './../models/Proxy';
import {Tape} from './../models/Tape';
import {Payload} from '../controllers/models/Payload';

export class Subnav extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showSettings : false
        }
    }

    componentDidMount() {
        var uploadTapeButton = document.getElementById("tapeUploadButton");
        var uploadTapeInput = document.getElementById("tapeUploadInput");
        uploadTapeButton.onclick = function(e) {
            uploadTapeInput.click();
        }.bind(this);
        uploadTapeInput.onchange = function() {
            console.info("Reading tape... " + uploadTapeInput.files[0].name);
            this.readTape();
        }.bind(this);
        $(".subnav.button").tipTop();
    }

    componentDidUpdate(prevProps, prevState){
    }


    readTape() {
        var uploadTapeInput = document.getElementById("tapeUploadInput");
        var file = uploadTapeInput.files[0];
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            var source = JSON.parse(evt.target.result);
            var tape = Tape.parseJSON(source);
            this.props.updateTapeHandler(Payload.actions.UPDATE, tape);
        }.bind(this);
    }

    showSettingsWindow() {
        this.setState({
            showSettings: true
        });
    }

    closeSettingsWindow() {
        this.setState({
            showSettings: false
        });
    }

    saveSettings() {
        var hostname = this.refs.hostnameInput.value;
        var port = this.refs.portInput.value;

        var filter = this.props.filter.clone();
        filter.host = hostname;
        filter.port = port;

        var proxyName = this.refs.proxyNameInput.value;
        var proxyPort = this.refs.proxyPortInput.value;

        var proxy = this.props.proxy.clone();
        proxy.name = proxyName;
        proxy.port = proxyPort;

        this.closeSettingsWindow();
        this.props.updateFilterHandler(Payload.actions.UPDATE, filter);
        this.props.updateProxyHandler(Payload.actions.UPDATE, proxy);
    }

    render() {
        var downloadTape = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.props.tape));
        var tapeUrl = "/rest/" + this.props.proxy.id + "/tape";

        var proxyTitle;
        if (State.cmp(this.props.filter.state, State.PROXY)) {
            proxyTitle = "Proxy"
        } else if (State.cmp(this.props.filter.state, State.RECORD)) {
            proxyTitle = "Record";
        } else {
            proxyTitle = "Mocked";
        }

        return (
            <div className="subnav">
                {(function() {
                    if (!this.state.showSettings) {
                        return;
                    }

                    return (
                        <div className="settings">
                            <div></div>
                            <div style={{marginBottom: "15px"}}>
                                <label>Hostname:
                                    <input ref="hostnameInput" type="text" defaultValue={this.props.filter.host} />
                                </label>
                                <label>Port:
                                    <input ref="portInput" type="text" defaultValue={this.props.filter.port} />
                                </label>
                                <label>Proxy Name:
                                    <input ref="proxyNameInput" type="text" defaultValue={this.props.proxy.name} />
                                </label>
                                <label>Proxy Port:
                                    <input ref="proxyPortInput" type="text" defaultValue={this.props.proxy.port} />
                                </label>
                            </div>
                            <a className="button" onClick={this.closeSettingsWindow.bind(this)}>Close</a>
                            <a className="button" onClick={this.saveSettings.bind(this)} style={{marginRight: "10px"}}>Save</a>
                        </div>
                    )
                }.bind(this))()}
                <div className="resizer"></div>
                <ul>
                    <li className="subnav button" data-title={"Recorder State: " + proxyTitle} onClick={this.props.toggleStateHandler}>
                        {
                            (function() {
                                var src = "./assets/images/red_circle_button.png";
                                if (State.cmp(this.props.filter.state, State.PROXY)) {
                                    src = "./assets/images/green_circle_button.png";
                                } else if (State.cmp(this.props.filter.state, State.MOCK)) {
                                    src="./assets/images/yellow_circle_button.png";
                                }

                                return (
                                    <img src={src} />
                                )
                            }.bind(this))()
                        }
                    </li>
                    <li className="subnav button" data-title={"Redirect: " + (this.props.filter.redirect ? "On" : "Off")} onClick={this.props.toggleRedirectHandler}>
                        {
                            (function() {
                                var src = "./assets/images/toggle_off.png";
                                if (this.props.filter.redirect) {
                                    src = "./assets/images/toggle_on.png";
                                }

                                return (
                                    <img src={src} style={{marginTop: "18px"}}/>
                                )
                            }.bind(this))()
                        }

                    </li>
                    <li className="subnav button" data-title="Import Tape" id="tapeUploadButton">
                        <i className="fa fa-download" aria-hidden="true" />
                        <input type="file" id="tapeUploadInput" style={{display: "none"}} onchange={this.readTape} />
                    </li>
                    <li className="subnav button" data-title="Export Tape" >
                        <a href={tapeUrl} >
                            <div style={{height: "100%", width: "100%"}}>
                                <i className="fa fa-upload" aria-hidden="true" />
                            </div>
                        </a>
                    </li>
                    <li className="subnav button" onClick={this.showSettingsWindow.bind(this)}  data-title="Settings">
                        <i className="fa fa-cog " aria-hidden="true" />
                    </li>
                </ul>
            </div>
        )
    }
}