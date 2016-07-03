/**
 * Created by HK on 6/9/2016.
 */


import React from 'react';
import {render} from 'react-dom';
import {State} from './../models/Event';
import {Settings} from './../models/Settings';

export class Subnav extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showSettings : false
        }
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

        var settings = this.props.settings.clone();
        settings.host = hostname;
        settings.port = port;

        this.closeSettingsWindow();
        this.props.updateSettingsHandler(settings);

    }

    render() {

        var downloadTape = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.props.tape));

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
                                    <input ref="hostnameInput" type="text" defaultValue={this.props.settings.host} />
                                </label>
                                <label>Port:
                                    <input ref="portInput" type="text" defaultValue={this.props.settings.port} />
                                </label>
                            </div>
                            <a className="button" onClick={this.closeSettingsWindow.bind(this)}>Close</a>
                            <a className="button" onClick={this.saveSettings.bind(this)} style={{marginRight: "10px"}}>Save</a>
                        </div>
                    )
                }.bind(this))()}

                <ul>
                    <li className="resizer"></li>

                    <li className="subnav button" title="Recorder State" onClick={this.props.toggleStateHandler}>
                        {
                            (function() {
                                var src = "./assets/images/red_circle_button.png";
                                if (State.cmp(this.props.settings.state, State.PROXY)) {
                                    src = "./assets/images/green_circle_button.png";
                                } else if (State.cmp(this.props.settings.state, State.MOCK)) {
                                   src="./assets/images/orange_circle_button.png";
                                }

                                return (
                                    <img src={src} />
                                )
                            }.bind(this))()
                        }
                    </li>
                    <li className="subnav button" title="Proxy Settings" onClick={this.props.toggleRedirectHandler}>
                        {
                            (function() {
                                var src = "./assets/images/toggle_off.png";
                                if (this.props.settings.redirect) {
                                    src = "./assets/images/toggle_on.png";
                                }

                                return (
                                    <img src={src} style={{marginTop: "18px"}}/>
                                )
                            }.bind(this))()
                        }

                    </li>
                    <li className="subnav button" title="Import Tape"><i className="fa fa-download" aria-hidden="true"></i></li>
                    <li className="subnav button" title="Export Tape">
                        <i className="fa fa-upload" aria-hidden="true" />

                    </li>
                    <li className="subnav button" onClick={this.showSettingsWindow.bind(this)}  title="Settings">
                        <i className="fa fa-cog " aria-hidden="true" />
                    </li>
                </ul>
            </div>
        )
    }
}