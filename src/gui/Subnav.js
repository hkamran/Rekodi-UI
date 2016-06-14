/**
 * Created by HK on 6/9/2016.
 */


import React from 'react';
import {render} from 'react-dom';


export class Subnav extends React.Component {

    constructor(props) {
        super(props);
        this.state = ""

        this.state = {
            toggleSrc: "./assets/images/green_circle_button.png",
            proxy: "RECORD"
        };
    }

    handleState() {
        console.log((this.state.proxy == "RECORD"));
        if (this.state.proxy == "RECORD") {
            this.setState({toggleSrc: "./assets/images/green_circle_button.png"});
            this.setState({proxy: "PROXY"});
            return;
        } else if (this.state.proxy == "PROXY") {
            this.setState({proxy: "MOCK"});
            this.setState({toggleSrc: "./assets/images/orange_circle_button.png"});
            return;
        } else {
            this.setState({proxy: "RECORD"});
            this.setState({toggleSrc: "./assets/images/red_circle_button.png"});
            return;
        }

    }

    render() {
        return (
            <div className="subnav">
                <ul>
                    <li className="resizer"></li>

                    <li className="subnav button" title="Recorder State" onClick={this.handleState.bind(this)}>
                        <img ref="myInput" src={this.state.toggleSrc}/>
                    </li>
                    <li className="subnav button" title="Proxy Settings">
                        <li className="subnav button" title="Proxy Settings"><i className="fa fa-toggle-on" aria-hidden="true"></i></li>
                    </li>
                    <li className="subnav button" title="Import Tape"><i className="fa fa-download" aria-hidden="true"></i></li>
                    <li className="subnav button" title="Export Tape"><i className="fa fa-upload" aria-hidden="true"></i></li>
                    <li className="subnav button" title="Settings"><i className="fa fa-cog " aria-hidden="true"></i></li>
                </ul>
            </div>
        )
    }
}