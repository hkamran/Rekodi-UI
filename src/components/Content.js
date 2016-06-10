/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';
import {Tape} from './Tape';
import {Message} from './Message';
import {Event} from './Event';

export class Content extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="content ">
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
            </div>
        )
    }
}
