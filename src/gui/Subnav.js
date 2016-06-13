/**
 * Created by HK on 6/9/2016.
 */


import React from 'react';
import {render} from 'react-dom';


export class Subnav extends React.Component {
    render() {
        return (
            <div className="subnav">
                <ul>
                    <li className="resizer"></li>

                    <li className="subnav button" title="Recorder State">
                        <i className="fa fa-circle" aria-hidden="true" ></i>
                    </li>
                    <li className="subnav button" title="Proxy Settings"><i className="fa fa-toggle-on" aria-hidden="true"></i></li>
                    <li className="subnav button" title="Import Tape"><i className="fa fa-download" aria-hidden="true"></i></li>
                    <li className="subnav button" title="Export Tape"><i className="fa fa-upload" aria-hidden="true"></i></li>
                    <li className="subnav button" title="Settings"><i className="fa fa-cog " aria-hidden="true"></i></li>
                </ul>
            </div>
        )
    }
}