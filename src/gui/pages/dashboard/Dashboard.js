/**
 * Created by HK on 6/9/2016.
 */
import React from 'react';
import {render} from 'react-dom';

import {TapeBox} from './components/TapeBox';
import {MessageBox} from './components/MessageBox';
import {EventBox} from './components/EventsBox';

import {Request} from '../../../models/Request';
import {Response} from '../../../models/Response';

export class Dashboard extends React.Component {


    render() {
        return (
            <div className="grow width height">
                <div id="analysisContainer" style={{height: "calc(50% - 5px)"}}>
                    <TapeBox tape={this.props.tape} message={this.props.message} search={this.props.search} setSearchHandler={this.props.setSearchHandler} setMessageHandler={this.props.setMessageHandler} />

                    <div id="analysisSplitter" className="splitter horizontal">
                        <div className="splitter horizontal grabber"></div>
                    </div>

                    <MessageBox message={this.props.message} updateMessageHandler={this.props.updateMessageHandler} />
                </div>

                <div id="contentSplitter">
                    <div className="splitter vertical">
                        <div className="splitter vertical grabber"></div>
                    </div>
                </div>

                <EventBox events={this.props.events} setMessageHandler={this.props.setMessageHandler} />
            </div>
        )
    }
}
