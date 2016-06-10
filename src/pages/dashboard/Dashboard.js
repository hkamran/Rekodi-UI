/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';
import {Tape} from './components/Tape';
import {Message} from './components/Message';
import {Event} from './components/Event';

export class Dashboard extends React.Component {
    render() {
        return (
            <div className="grow width height">
                <div id="analysisContainer" style={{height: "calc(50% - 5px)"}}>
                    <Tape />

                    <div id="analysisSplitter" className="splitter horizontal">
                        <div className="splitter horizontal grabber"></div>
                    </div>

                    <Message />
                </div>

                <div id="contentSplitter">
                    <div className="splitter vertical">
                        <div className="splitter vertical grabber"></div>
                    </div>
                </div>

                <Event />
            </div>
        )
    }
}
