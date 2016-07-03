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

    constructor(props) {
        super(props);

        this.state = {
            resetMessageHandler : function () {

            }
        }
    }

    setResetMessageHandler(handle) {
        this.setState({
            resetMessageHandler : handle
        })
    }

    resetMessageHandler() {
        this.state.resetMessageHandler();
    }

    render() {
        return (
            <div className="grow width height">
                <div id="analysisContainer" style={{height: "calc(50% - 5px)"}}>
                    <TapeBox tape={this.props.tape}
                             message={this.props.message}
                             search={this.props.search}
                             clearTapeHandler={this.props.clearTapeHandler}
                             setSearchHandler={this.props.setSearchHandler}
                             setMessageHandler={this.props.setMessageHandler}
                             resetMessageHandler={this.resetMessageHandler.bind(this)}
                    />
                    <div id="analysisSplitter" className="splitter horizontal">
                        <div className="splitter horizontal grabber"></div>
                    </div>

                    <MessageBox
                        message={this.props.message}
                        updateMessageHandler={this.props.updateMessageHandler}
                        setResetMessageHandler={this.setResetMessageHandler.bind(this)}
                    />
                </div>

                <div id="contentSplitter">
                    <div className="splitter vertical">
                        <div className="splitter vertical grabber"></div>
                    </div>
                </div>

                <EventBox events={this.props.events}
                          message={this.props.message}
                          setMessageHandler={this.props.setMessageHandler}
                          setEventsHandler={this.props.setEventsHandler}
                          resetMessageHandler={this.resetMessageHandler.bind(this)}
                />
            </div>
        )
    }
}
