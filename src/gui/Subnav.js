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


    }

    render() {

        return (
            <div className="subnav">
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
                    <li className="subnav button" title="Export Tape"><i className="fa fa-upload" aria-hidden="true"></i></li>
                    <li className="subnav button" title="Settings"><i className="fa fa-cog " aria-hidden="true"></i></li>
                </ul>
            </div>
        )
    }
}